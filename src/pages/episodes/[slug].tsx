import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/ConvertDurationToTimeString'
import { usePlayer } from '../../contexts/PlayerContext'

import styles from './episode.module.scss'

type Episode = {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
  members: string
  durationAsString: string
  duration: number
  url: string
  description: string
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button"><img src="/arrow-left.svg" alt="Back" /></button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />

        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Play episode" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span> {episode.members} </span>
        <span> {episode.publishedAt} </span>
        <span> {episode.durationAsString} </span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort: "published_ad",
      _order: "desc"
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy'),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    duration: Number(data.file.duration),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24hours
  }
}