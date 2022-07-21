import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow.js';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';


export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);


  useEffect(()=> {
      const loadAll = async () => {

        //lista total
        let list = await Tmdb.getHomeList();
        setMovieList(list);


        //Filme em destaque
        let originals = list.filter(i=>i.slug === 'originals');
        let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
        let chosen = originals[0].items.results[randomChosen];
        let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

        setFeaturedData(chosenInfo);

      }

      loadAll();

    }, []);


  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 20) {
        setBlackHeader (true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
  
        return () => {
        window.removeEventListener('scroll', scrollListener);
    }


  }, []);

  return (
    <div className='page'>

      <Header black={blackHeader} />

      {featuredData && 
        <FeaturedMovie item={featuredData} />


      }

      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito por Ana Karina Caetano <br/>
        Inspirado em <a href='https://www.youtube.com/watch?v=tBweoUiMsDg' target="_blank">Bonieky Lacerda</a> <br/>
        Dados obtidos pela API do site themoviedb.org <br/>
        Todos direitos de imagem para Netflix <br/>

      </footer>

      {movieList.length <= 0 &&

        <div className='loading'>
          <img src='https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif' alt='Carregando'></img>
        </div>
      
      }

    </div>
  );
}