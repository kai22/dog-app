import { createStore } from "redux";


const breedFilterState = {
    breeds:{},
    filters: [
      { id: 0, breed: '', subBreed: '', subBreedArray:[], imgCount:0, imgArray:[] }
   
    ]
  }
  
  function nextBreedFilterId(breeds) {
    const maxId = breeds.reduce((maxId, breed) => Math.max(breed.id, maxId), -1)
    return maxId + 1
  }
  
  
  function breedReducer(state = breedFilterState, action) {
    switch (action.type) {
  
      case 'breed/filterAdded': {

        console.log('adding filter')
  
        return {
          ...state,
  
          filters: [
  
            ...state.filters,
            {
              id: nextBreedFilterId(state.filters),
              breed:'',
              subBreed:'',
              subBreedArray:[],
              imgCount:0,
              imgArray:[]
            }
          ]
        }
      }
      case 'breed/filterRemoved': {
        console.log('removing filter')
        return {
          ...state,
  
          filters: state.filters.filter(f => {
              return f.id !== action.payload
            }
          )
        }
      }
      case 'breed/breedUpdated': {
  
        return {
          ...state,
  
          filters: state.filters.map(filter => {
            if (filter.id !== action.payload.breedID) {
              return filter
            }
  
            return {
              ...filter,
              breed: action.payload.breed
            }
          })
        }
      }
  
      case 'breed/subBreedUpdated': {
  
        return {
          ...state,
  
          filters: state.filters.map(filter => {
            if (filter.id !== action.payload.breedID) {
              return filter
            }
  
            return {
              ...filter,
              subBreed: action.payload.subBreed
            }
          })
        }
      }
  
      case 'breed/addBreedList': {
        return {
          ...state,
  
          breeds: action.payload
        
        }
      }

      case 'breed/updateSubBreedList': {
        return {
          ...state,
  
          filters: state.filters.map(filter => {
            if (filter.id !== action.payload.breedID) {
              return filter
            }
  
            return {
              ...filter,
              subBreedArray: (state.breeds[filter.breed] ? state.breeds[filter.breed] : [])
            }
          })
        }
      }

      case 'breed/updateImgCount': {
        return {
          ...state,
  
          filters: state.filters.map(filter => {
            if (filter.id !== action.payload.breedID) {
              return filter
            }
  
            return {
              ...filter,
              imgCount: action.payload.total,
              imgArray: action.payload.images
            }
          })
        }
      }
      default:
        return state
    }
  }
  

  export default createStore(breedReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
