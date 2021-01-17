import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import * as kinveySetup from '../../../../services/kinveySetup';
import './ExerciseDetails.css';
import Loading from '../../../UI/Loading/Loading';

const ExerciseDetails = (props) => {
  const [exercise, setExercise] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Kinvey ${localStorage.getItem('authtoken')}`;
    axios
      .get(
        kinveySetup.baseUrl +
          'appdata/' +
          kinveySetup.appKey +
          '/activities/' +
          props.match.params.id
      )
      .then((response) => {
        setExercise(response.data);
        setIsLoaded(true);
      })
      .catch((err) => console.log(err));
  }, [props.match.params.id]);

  const deleteExercise = () => {
    // eslint-disable-next-line no-restricted-globals
    let agreed = confirm('Are you sure you want to delete this exercise?');
    if (agreed) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Kinvey ${localStorage.getItem('authtoken')}`;
      axios
        .delete(
          kinveySetup.baseUrl +
            'appdata/' +
            kinveySetup.appKey +
            '/activities/' +
            props.match.params.id
        )
        .then((response) => {
          toast.success('Succesfully deleted item!');
          props.history.push('/user/my-exercises');
        })
        .catch((err) => console.log(err));
    }
  };

  const editExercise = () => {
    const query = `?id=${exercise._id}&title=${exercise.title}&imageUrl=${exercise.imageUrl}&series=${exercise.series}&repeats=${exercise.repeats}&difficulty=${exercise.difficulty}`;
    props.history.push('/user/add' + query);
  };

  let dataToDisplay = isLoaded ? (
    <section className='exercise-details'>
      <h1>{exercise.title}</h1>
      <div>
        <img src={exercise.imageUrl} alt='exercise-details' />
        <div className='on-right'>
          <p>Series: {exercise.series}</p>
          <p>Repeats: {exercise.repeats}</p>
          <p>Difficulty: {exercise.difficulty}</p>
          <div className='button-controls'>
            <button className='info-btn' onClick={editExercise}>
              Edit
            </button>
            <button className='danger-btn' onClick={deleteExercise}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <Loading />
  );

  return <div>{dataToDisplay}</div>;
};

export default ExerciseDetails;
