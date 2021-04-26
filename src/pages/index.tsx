import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { format, parseISO } from 'date-fns'

import { convertDurationToTimeString } from '../utils/ConvertDurationToTimeString'
import { api } from '../services/api'
import styles from './home.module.scss'

type Episode = {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
  members: string
  durationAsString: string
  duration: number
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

//chamada API em SSG(Static site generator) => faz o mesmo que o SSR porém mudando o nome da função e 
//passando no return a opção de revalidate com os segundos para acontecer o recarregamento da api
//então com este metodo quando uma pessoa acessar a home, é gerado um html estático que será mostrado para
//as proximas pessoa que acessarem o site, e mudará apenas quando a api carregar novamente, assim repetindo o processo

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>últimos lançamentos</h2>
         
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="./play-green.svg" alt="Play episode" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="./play-green.svg" alt="Play episode" />
                    </button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: "published_ad",
      _order: "desc"
    }
  })
  //const data = response.data

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy'),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      duration: Number(episode.file.duration),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8, //a cada 8 horas gera uma nova versao
  }
}


//SPA:
/* export default function Home(props) {
  chamada API no formato SPA (ñ é indexável à google pois "demora" um pouco para carregar)
    useEffect(() => {
      fetch('http://localhost:3333/episodes')
        .then(response => response.json())
        .then(data => console.log(data))
    }, [])
  return (
      <div>
          <h1>Index</h1>
          <p>{JSON.stringify(props.episodes)}</p>
      </div>
  )
} */

/* SSR:
chamada API em SSR(Server side rendering) => basta ir em qualquer arquivo da pasta pages e fazer o seguinte:
executa a função toda vez que a pagina é carregada por alguem
export default function Home(props) {
  return (
      <div>
          <h1>Index</h1>
          <p>{JSON.stringify(props.episodes)}</p>
      </div>
  )
}
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  return {
    props: {
      episodes: data,
    }
  }
} */