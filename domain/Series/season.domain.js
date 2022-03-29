const Series = require("../../models/Series/series.model");
const season = require("../../models/Series/season.model");
const Episode = require("../../models/Series/episode.model");
class seasonDomain {
  // create new season
  async createAnseason(req, res) {
    var data = req.body;
    var id = req.params.series_id;
    const result = await Series.findById(id);

    if (!result) {
      res.status(404).send({ msg: `${id} not found` });
      return;
    }

    const Season = new season({
      _id: data._id,
      SeasonName: data.SeasonName,
      SeasonNumber: data.SeasonNumber,
      SeriesID: data.SeriesID,
      Description: data.Description,
      Number_of_episodes: data.Number_of_episodes,
      Banner: data.Poster_path,
      Episodes: data.Episodes,
      IsActive: data.IsActive,
    });
    const UpdateSeries = await Series.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          Seasons: data._id,
        },
      },
      { new: true }
    );

    const newseason = await Season.save();
    if (newseason) {
      res.send({
        season: newseason,
        serires: {
          series_id: UpdateSeries._id,
          series_name: UpdateSeries.SeriesName,
          seasons: UpdateSeries["Seasons"],
        },
      });
    } else {
      res.send("can't create new season");
    }
  }

  // get all season
  async getAllseason(req, res) {
    var id = req.params.series_id;

    const findSeason = await season.find({ SeriesID: id });

    if (!findSeason) return res.status(404).send({ msg: "Not able to find." });

    res.status(200).send({ seasons: findSeason });
  }

  // get season by id

  async getAnseason(req, res) {
    var SeriesID = req.params.series_id;
    var seasonID = req.params.season_id;

    const season_result = await season
      .findOne({ SeriesID, _id: seasonID })
      .populate("Episodes");

    if (!season_result || !season_result.IsActive)
      return res.status(404).json({ msg: `Season id ${seasonID} not found` });

    res.status(200).send({ seasons: season_result });
  }

  // delete season by id

  async deleteAnseason(req, res) {
    var SeriesID = req.params.series_id;
    var seasonID = req.params.season_id;

    const season_result = await season.findOne({ SeriesID, _id: seasonID });
    if (!season_result)
      return res.status(404).json({ msg: `Season Not found` });

    await season.findOneAndUpdate(
      { _id: seasonID },
      {
        $set: {
          IsActive: false,
        },
      }
    );
    await Series.findOneAndUpdate(
      { _id: SeriesID },
      {
        $pull: {
          Seasons: seasonID,
        },
      },
      { new: true }
    );
    await Episode.updateMany(
      {
        SeasonID: seasonID,
      },
      {
        IsActive: false,
      }
    );

    res.status(200).send("Successfully deleted");
  }

  //   Edit season
  async editAnseason(req, res) {
    var data = req.body;
    var seriesID = req.params.series_id;
    var SeasonNumber = req.query.SeasonNumber;
    const series_result = await season.findOne({ seriesID });
    const season_result = await season.find({ SeasonNumber });

    if (!series_result)
      return res.status(404).json({ msg: `Series id ${seriesID} not found` });

    if (!season_result)
      return res.status(404).json({ msg: `Season id ${seriesID} not found` });

    const updateseason = await season.findOneAndUpdate(
      SeasonNumber,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if (!updateseason)
      return res
        .status(500)
        .send({ msg: `Can't update season with id ${SeasonNumber}` });

    res.status(200).send(updateseason);
  }

  // get all episode from season
  async getAllEpisodesOfSeason(req, res) {
    var SeriesID = req.params.series_id;
    var seasonID = req.params.season_id;

    const findSeason = await season
      .findOne({ SeriesID, _id: seasonID })
      .populate("Episodes");

    if (!findSeason)
      return res
        .status(404)
        .json({ msg: `Season Number ${seasonID} not found` });

    res.status(200).send(findSeason);
  }

  // get specific episode from season
  async getAnEpisodeOfSeason(req, res) {
    const SeasonId = Number(req.params.SeasonId);
    const EpisodeId = Number(req.params.EpisodeId);

    const findSeason = await season.findById(SeasonId).populate("Episodes");

    if (!findSeason)
      return res
        .status(404)
        .json({ msg: `Season Number ${SeasonId} not found` });

    const findEpisode = await season.find({ Episodes: { _id: EpisodeId } });

    if (!findEpisode)
      return res
        .status(404)
        .json({ msg: `Episode Number ${EpisodeId} not found` });

    res.status(200).send(findEpisode);
  }

  // find and filter seasion data
  async findSeasionAndSort(req, res) {
    const series_id = req.query.series_id;
    const queryperam = req.query.filter;
    const order = req.query.order;

    const seasion = await season
      .find({ SeriesID: series_id })
      .populate("SeriesID")
      .populate("Episodes")
      .sort(queryperam);

    if (!seasion) return res.status(404).send({ msg: `seasion not found` });

    if (order == "descending") return res.status(200).send(seasion.reverse());

    return res.status(200).send(seasion);
  }

  // search seasion
  async findseasionBySearch(req, res) {
    const series_id = req.query.series_id;
    const queryperam = req.query.item1;
    const queryName = req.query.item;

    const seasionData = await season
      .find({
        SeriesID: series_id,
        [queryperam]: queryName,
      })
      .populate("SeriesID")
      .populate("Episodes")
      .sort(`${queryperam}`);

    if (seasionData.length <= 0)
      return res.status(500).send({ msg: `seasion not found` });

    return res.status(200).send(seasionData);
  }
}

module.exports = seasonDomain;
