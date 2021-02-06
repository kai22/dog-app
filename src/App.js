import React from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';

import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Modal from '@material-ui/core/Modal';
import { FormControl } from '@material-ui/core';


function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "95%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  control: {
    padding: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  textCenter:{
    textAlign:'center'
  },
  gButton:{
    width:"90%",
    padding:5,
    margin:25
  },
  paper: {
    height: 75,
    width: "100%",
    textAlign:'center',
    marginBottom:25,
    marginTop:25
  },
  modal: {
    position: 'absolute',
    width: "90%",
    height:"75%",
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  gridList: {
    width: "100%",
    height: "100%",
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'center'
  },
}));


function BreedSelect(props){

  const breeds = useSelector(state => state.breeds);
  const dispatch = useDispatch();

  const selectChange = (ev) => {

    let sb = (breeds[ev.target.value].length > 0) ? breeds[ev.target.value][0] : '';

    const superDispatch = (b, sb, id, count, imgArr)  => {

      dispatch({ type: 'breed/breedUpdated', payload: {breed: b, breedID: id}});
      dispatch({ type: 'breed/updateSubBreedList', payload: {breed: b, breedID: id}});
      dispatch({ type: 'breed/subBreedUpdated', payload: {subBreed:sb, breedID: id}});
      dispatch({ type: 'breed/updateImgCount', payload: {total:count, breedID: id, images:imgArr}});
    }

      fetch(`https://dog.ceo/api/breed/${ev.target.value}${sb ? '/'+sb : ''}/images`)
      .then(res => res.json())
      .then((result) => {

        let count = result.message.length;
        superDispatch(ev.target.value, sb, props.id, count, result.message);
      })
  }

    return (
      <Select labelId="mainBreed-select"
        id="select-breed"
        defaultValue="none"
        label="Dog Breed"
        onChange={selectChange}>
          <MenuItem value="none" disabled>
            Choose Breed
          </MenuItem>

          {Object.keys(breeds).map(breed => (
              <MenuItem key={breed} value={breed}>{breed}</MenuItem>
          ))}
      </Select>
    )
}

function SubBreedSelect(props){

  const breedFilter = useSelector(state => state.filters.filter((f) => f.id == props.id))[0];
  const dispatch = useDispatch();

  const selectChange = (ev) => {

    let sb = ev.target.value;

    const superDispatch = (sb, id, count, imgArr)  => {

      dispatch({ type: 'breed/subBreedUpdated', payload: {subBreed:sb, breedID: id}});
      dispatch({ type: 'breed/updateImgCount', payload: {total:count, breedID: id, images:imgArr}});
    }

      fetch(`https://dog.ceo/api/breed/${breedFilter.breed}/${sb}/images`)
      .then(res => res.json())
      .then((result) => {

        let count = result.message.length;
        superDispatch(ev.target.value, props.id, count, result.message);
      })
  }

  const getSubBreeds = (f) => {

      if(f.subBreedArray.length > 0){
        return (
          f.subBreedArray.map(sb => (
              <MenuItem key={sb} value={sb}>
              {sb}
              </MenuItem>
            ))
        )
      } else {

        return (
          <MenuItem value="none">
            No Sub Breeds
          </MenuItem>
        )
      }
  }

    return (
      <Select labelId="subBreed-select"
          id="select-subBreed"
          label="Dog Sub-Breed"
          value={breedFilter.subBreed ? breedFilter.subBreed : "none"}
          onChange={selectChange}>
          {getSubBreeds(breedFilter)}
         
        </Select>
    )
}


function FilterRow(props) {

  const classes = useStyles();

  return ( 
    <Grid container direction="row" justify="center" alignItems="center">
      
      <Grid item xs={3}>
      <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="mainBreed-select">Dog Breed</InputLabel>
          {props.first}
        </FormControl>
      </Grid>

      <Grid item xs={3}>
      <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="subBreed-select">Dog Sub-Breed</InputLabel>
          {props.second}
        </FormControl>
      </Grid>

      <Grid item xs={3}>
        <Grid container justify="center" alignItems="center">
        <Grid item xs={4}>
            {`${props.count} Images`}
        </Grid>
          <Grid item xs={2}>
            {props.fid !== 0 ? props.delete : '' }
          </Grid>
          <Grid item xs={2}>
            {props.fid == props.max ? props.add : ''}
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
}

function AddButton(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  return ( 
    <IconButton aria-label="add" className={classes.margin}  onClick={() => dispatch({type:'breed/filterAdded'})}>
      <AddCircleSharpIcon fontSize="default" />
    </IconButton>
  )
}

function DelButton(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  return ( 
    <IconButton aria-label="delete" className={classes.margin} onClick={() => dispatch({type:'breed/filterRemoved', payload:props.id})}>
      <DeleteSharpIcon fontSize="default" />
    </IconButton>
  )
}

function DogHeader(){
  const classes = useStyles();

  return(
    <Grid container direction="row" justify="center" alignItems="center">
         <Grid item xs={10}>
           <Paper elevation={2} variant="outlined" className={classes.paper}>
             <h1>DOG POSTER-O-TRON 5000</h1>
           </Paper>
         </Grid>
    </Grid>
  )
}

function DogFooter(props){
  const classes = useStyles();

  return(
    <Grid container direction="row" justify="center" alignItems="center">
         <Grid item xs={10} className={classes.textCenter}>
             <Button variant="contained" color="primary" className={classes.gButton} onClick={() => props.handleOpen()}>GENERATE POSTER</Button>
         </Grid>
    </Grid>
  )
}

function App() {

  const classes = useStyles();
  const filters = useSelector(state => state.filters);
  const dispatch = useDispatch();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then(res => res.json())
      .then(
        (result) => {
          dispatch({ type: 'breed/addBreedList', payload: result.message})
        })

    }, []);

    const imgTiles = (f) => {

      function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
      
      let imgs = f.map((x) => x.imgArray)
      let merged = [].concat.apply([], imgs);
      return shuffle(merged);
    }



  return (

    <div>
      <DogHeader/>

      { filters.map( (filter) => (

        <FilterRow 
        key={filter.id}
        fid={filter.id}
        max={filters.length-1}
        first={<BreedSelect id={filter.id} />} 
        second={<SubBreedSelect id={filter.id} />}
        count={filter.imgCount}
        delete={<DelButton id={filter.id} />} 
        add={<AddButton id={filter.id} />} />

      )) }

      <DogFooter handleOpen={handleOpen} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">

        <div style={modalStyle} className={classes.modal}>
          <GridList cellHeight={400} className={classes.gridList} cols={4}>
            {imgTiles(filters).map((tile,i) => (
              <GridListTile key={i} cols={Math.floor(Math.random() * 2) + 1}>
                <img src={tile} alt={`it's a dog`} />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </Modal>

    </div>

  );
}


export default App;
