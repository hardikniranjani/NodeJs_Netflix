require("dotenv").config();
const MovieModel = require("../models/movie.model");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

 function  isMediaAvailable(mediaValueToFind){
    return mediaValueToFind !=='';
  }


class MovieDomain {
  // create movie
  async createAnMovie(req, res) {
    var data = req.body;
    // console.log(data)
    const findMovie = await MovieModel.findOne({MovieName : data.MovieName});

    if (findMovie)
      return res.status(400).send({ msg: `Movie ${data.MovieName} already  available` });

    let allMovies = await MovieModel.find().sort({_id : -1});

    let id = allMovies.length == 0 ? 1 : allMovies[0]._id + 1;
    let Movie = new MovieModel({
      _id: id,
      ...data
    });

    try {
      const newMovie = await Movie.save();
      if (newMovie) {
        return res.send(newMovie);
      } else {
        return res.status(400).send("We can't create a new Movie");
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).send(`some error ${e}`);
    }
  }

  // uplode movie Image
  async uploadMovieImage(req, res) {
    const movie_id = req.query.movie_id;
    const field = req.query.media_field;
    const findMovie = await MovieModel.findById(movie_id);
    
    if (!findMovie)
      return res
        .status(400)
        .send({ msg: `Can't found movie with id ${movie_id}` });

    if (!req.files[field])
      return res.status(404).send({ msg: "Kindly upload all necessary data." });

    const banner = req.files[field];

    const bannerType = banner.mimetype.split("/");

    if (bannerType[0] !== "image")
      return res
        .status(400)
        .send({ msg: "Make sure your banner must be an image." });

    let pathForCloudinary = `OttPlatForm/Movies/${findMovie.MovieName}/${
      bannerType[0] + "s"
    }/${new Date().valueOf()}`;

    //  await banner.mv(bpath, (err) => {
    //     if (err) return res.status(500).send({ msg: `error : ${err.message}` });
    //   });

    await cloudinary.uploader
      .upload(banner.tempFilePath, { public_id: pathForCloudinary })
      .then(async (result) => {
        const updateMovie = await MovieModel.findOneAndUpdate(
          { _id: movie_id },
          {
            $set: {
              [field]: result.url,
            },
          },
          { new: true }
        );

        if (!updateMovie)
          return res.status(400).send({ msg: "not able to upload movie" });
        fs.unlinkSync(`${banner.tempFilePath}`);
        res.status(200).send({ movie: updateMovie });
      })
      .catch((err) => {
        fs.unlinkSync(`${banner.tempFilePath}`);
        res.status(500).send({ err: `${err.msg}` });
      });
  }

  // uplode movie video
  async uploadMovieVideo(req, res) {
    const movie_id = req.query.movie_id;
    const findMovie = await MovieModel.findById(movie_id);

    if (!findMovie)
      return res
        .status(400)
        .send({ msg: `Can't found movie with id ${movie_id}` });

    if (!req.files.video)
      return res.status(404).send({ msg: "Kindly upload all necessary data." });

    const video = req.files.video;

    const videoType = video.mimetype.split("/");

    if (videoType[0] !== "video")
      return res
        .status(400)
        .send({ msg: "Make sure your file must be type mp4." });

    let pathForCloudinary = `OttPlatForm/Movies/${findMovie.MovieName}/${
      videoType[0] + "s"
    }/${new Date().valueOf()}`;

    await cloudinary.uploader
      .upload(video.tempFilePath, {
        resource_type: "video",
        public_id: pathForCloudinary,
      })
      .then(async (result) => {
        const updateMovie = await MovieModel.findOneAndUpdate(
          { _id: movie_id },
          {
            $set: {
              Video_path: result.url,
            },
          },
          { new: true }
        );
        fs.unlinkSync(`${video.tempFilePath}`);
        if (!updateMovie)
          return res.status(400).send({ msg: "not able to upload movie" });
        res.status(200).send({ movie: updateMovie });
      })
      .catch((err) => {
        res.status(500).send({ err: `${err}` });
      });
    fs.unlinkSync(`${video.tempFilePath}`);
  }

 
  // get all Movie
  async getAllMovie(req, res) {
    let Movie_data = await MovieModel.find({ IsActive: true })
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies");
    if (Movie_data.length > 0) {
      let MoviesWithAllData = Movie_data.filter((obj)=>{
        
        if(isMediaAvailable(obj.Banner) && isMediaAvailable(obj.backdrop_path)){
            return obj;
        }
      })  
      
      res.send(MoviesWithAllData.reverse());
    } else {
      res.send("not found");
    }
  }

  // get Movie by id
  async getAnMovie(req, res) {
    var id = req.params.id;

    const result = await MovieModel.findById(id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send("Can't find Movie");
    }
  }

  // sorting movie
  async sortMovie(req, res) {
    var category = req.query.sortBy;
    const result = await MovieModel.find()
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies")
      .sort(category);

    res.send(result);
  }

  //soft delete Movie by id
  async deleteAnMovie(req, res) {
    var id = req.params.id;

    const findMovie = await MovieModel.find({ _id: id });
    if (!findMovie) return res.status(404).send({ msg: "Can't find movie" });

    const result = await MovieModel.findByIdAndUpdate(id, {
      $set: {
        IsActive: false,
      },
    });

    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find Movie");
    }
  }

  // Hard Delete Movie by id
  async hardDeleteMovie(req, res) {
    var id = req.params.id;

    const result = await Movies.findByIdAndDelete(id);
    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find Movie");
    }
  }

  // Edit Movie
  async editAnMovie(req, res) {
    var data = req.body;
    const id = req.params.id;

    const Movie = await MovieModel.findById(id);
    if (!Movie) res.send("Movie Not Found");
    const UpdateMovie = await MovieModel.findByIdAndUpdate(
      id,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if (UpdateMovie) {
      res.send(UpdateMovie);
    } else {
      res.send("Can't update Movie");
    }
  }

  // find and movie series data
  async findMovieBySort(req, res) {
    const queryperam = req.query.filter;
    const Ascending = req.query.ascending;

    const movieData = await MovieModel.find()
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies")
      .sort(queryperam);

    if (!movieData) return res.status(404).send({ msg: `movie not found` });

    if (Ascending == "descending")
      return res.status(200).send(movieData.reverse());

    return res.status(200).send(movieData);
  }

  // search movie and filter results
  async findMovieBySearch(req, res) {
    const queryperam = req.query.item1;
    const queryName = req.query.item;

    const movieData = await MovieModel.find({
      [queryperam]: queryName,
      IsActive: true,
    })
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies")
      .sort(`${queryperam}`);

    if (movieData.length <= 0)
      return res.status(404).send({ msg: `Movies not found` });

    return res.status(200).send(movieData);
  }
}

module.exports = MovieDomain;
