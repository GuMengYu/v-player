import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AlbumData } from '../album/album.entity'
import { AlbumArtwork } from '../albumArtwork/albumArtwork.entity'
import { FolderTrack } from '../folderTrack/folder-track.entity'
import { Folder } from '../folder/folder.entity'
import { ArtistData } from '../artist/artist-data'
import { ClauseCreator } from '../utils/clause-creator'
import { Constants } from '../utils/constant/constants'
import { QueryParts } from '../utils/constant/query-parts'
import { PlaylistTrack } from '../playlistTrack/playlist-track.entity'
import { Track } from './track.entity'
import { TrackModel } from './track-model'

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepo: Repository<Track>) {
  }

  async getNumberOfTracksThatDoNotBelongFolders() {
    return await this.trackRepo.createQueryBuilder()
      .where((qb) => {
        const subQuery = qb.subQuery()
          .select('trackId')
          .from('folder_track', 'FolderTrack')
          .where('FolderTrack.folderId NOT IN (SELECT folderId FROM folder)')
          .getQuery()
        return `Track.trackId IN ${subQuery}`
      }).getCount()
  }

  public async deleteTracksThatDoNotBelongFolders() {
    const subQuery = this.trackRepo.createQueryBuilder()
      .select('FolderTrack.trackId', 'TrackID')
      .from('folder_track', 'FolderTrack')
      .where('FolderTrack.FolderID NOT IN (SELECT folderId FROM folder)')
      .getQuery()
    const res = await this.trackRepo.createQueryBuilder()
      .delete()
      .where(`Track.trackId IN (${subQuery})`).execute()

    return res.affected
  }

  async getAllTracks() {
    return await this.trackRepo.find()
  }

  async getAllTracksNormalized() {
    const tracks = await this.trackRepo.find()
    return tracks.map(track => this.normalizeTrack(track))
  }

  public normalizeTrack(track: Track) {
    const trackModel = new TrackModel(track)
    return {
      id: trackModel.id,
      name: trackModel.fileName,
      url: trackModel.path,
      dt: trackModel.durationInMilliseconds,
      bit: trackModel.bitRate,
      sample: trackModel.sampleRate,
      ar: trackModel.artists?.split(',').map(i => ({
        name: i,
        id: i,
      })),
      al: {
        id: trackModel.albumTitle,
        name: trackModel.albumTitle,
      },
      size: trackModel.fileSizeInBytes,
      liked: trackModel.love === 1,
      local: true,
    }
  }

  public async getTracksForAlbums(albumKey: string) {
    const tracks = await this.trackRepo.findBy({ albumKey: albumKey ?? '' })

    return tracks.map(track => this.normalizeTrack(track))

  }

  public async getTracksForLiked() {
    const tracks = await this.trackRepo.findBy({ love: 1 })

    return tracks.map(track => this.normalizeTrack(track))

  }

  public async getTracksForPlaylist(playlistId: number) {
    const tracks = await this.trackRepo
      .createQueryBuilder('t')
      .innerJoin(PlaylistTrack, 'pt', 'pt.trackId = t.trackId')
      .where('pt.playlistId = :playlistId', { playlistId })
      .getMany()

    return tracks.map(track => this.normalizeTrack(track))
  }

  public async deleteTrack(trackId: number) {
    try {
      const deleteResult = await this.trackRepo
        .createQueryBuilder()
        .delete()
        .where('trackId = :trackId', { trackId })
        .execute()
      console.log(deleteResult)
    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }
  }

  public async getTrackByPath(path: string) {
    try {
      return await this.trackRepo.findOneBy({ path })
    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }
  }

  public async getTrackById(trackId: number) {
    try {
      return await this.trackRepo.findOneBy({ trackId })
    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }
  }

  public async deleteTracks(trackIds: number[]) {
    try {
      const deleteResult = await this.trackRepo
        .createQueryBuilder()
        .delete()
        .where('trackId IN (:...trackIds)', { trackIds })
        .execute()
      console.log(deleteResult)
    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }
  }

  public async updateTrack(track: Track) {
    await this.trackRepo.save(track)
  }

  public async updateLove(trackId: number, love: number) {
    await this.trackRepo.createQueryBuilder()
      .update().set({ love })
      .where('trackId = :trackId', { trackId })
      .execute()
  }

  public async updateRating(trackId: number, rating: number) {
    await this.trackRepo.createQueryBuilder()
      .update().set({ rating })
      .where('trackId = :trackId', { trackId })
      .execute()
  }

  public async addTrack(track: Track) {
    await this.trackRepo.save(track)
  }

  public async getAllAlbumData() {
    const result = await this.trackRepo
      .createQueryBuilder('t')
      .select([
        't.albumTitle as albumTitle',
        't.albumArtists as albumArtists',
        't.albumKey as albumKey',
        'a.artworkId as artworkId',
        'MAX(t.artists) as artists',
        'MAX(t.year) as year',
        'MAX(t.dateFileCreated) as dateFileCreated',
        'MAX(t.dateAdded) as dateAdded',
        'MAX(t.dateLastPlayed) as dateLastPlayed',
      ])
      .leftJoin(AlbumArtwork, 'a', 't.albumKey = a.albumKey')
      .innerJoin(FolderTrack, 'ft', 'ft.trackID = t.trackId')
      .innerJoin(Folder, 'f', 'ft.folderId = f.folderId')
      .where('t.indexingSuccess = 1 AND t.needsIndexing = 0')
      .groupBy('t.albumKey')
      .getRawMany()

    return result as AlbumData[]
  }

  public async getAlbumDataForAlbumKey(albumKey: string) {
    const albumData = await this.trackRepo.createQueryBuilder('t').select([
      't.albumTitle as albumTitle',
      't.albumArtists as albumArtists',
      't.albumKey as albumKey',
      'a.artworkId as artworkId',
      'MAX(t.artists) as artists',
      'MAX(t.year) as year',
      'MAX(t.dateFileCreated) as dateFileCreated',
      'MAX(t.dateAdded) as dateAdded',
      'MAX(t.dateLastPlayed) as dateLastPlayed'])
      .leftJoin(AlbumArtwork, 'a', 't.albumKey = a.albumKey')
      .where(`t.albumKey = '${albumKey}'`)
      .groupBy('t.albumKey')
      .getRawMany()
    return albumData as AlbumData[]
  }

  public async getAlbumDataForTrackArtists(trackArtists: string[]) {

    let filterQuery: string = ''

    if (trackArtists && trackArtists.length > 0)
      filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.artists', trackArtists, Constants.columnValueDelimiter)}`


    const albumData =  await this.trackRepo.query(`${QueryParts.selectAlbumDataQueryPart(true)} ${filterQuery}
                                                AND t.albumKey IS NOT NULL AND t.albumKey <> ''
                                                GROUP BY t.albumKey;`)
    return albumData as AlbumData[]
  }

  public async getAlbumDataForAlbumArtists(albumArtists: string[]) {

    let filterQuery: string = ''

    if (albumArtists && albumArtists.length > 0)
      filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.albumArtists', albumArtists, Constants.columnValueDelimiter)}`


    const albumData = await this.trackRepo.query(`${QueryParts.selectAlbumDataQueryPart(true)} ${filterQuery}
                                                AND t.albumKey IS NOT NULL AND t.albumKey <> ''
                                                GROUP BY t.albumKey;`)


    console.log(albumData)

    return albumData as AlbumData[]
    return albumData
  }

  public async getAlbumDataThatNeedsIndexing() {
    const albumData = await this.trackRepo.createQueryBuilder('t').select([
      't.albumTitle as albumTitle',
      't.albumArtists as albumArtists',
      't.albumKey as albumKey',
      'a.artworkId as artworkId',
      'MAX(t.artists) as artists',
      'MAX(t.year)            as year',
      'MAX(t.dateFileCreated) as dateFileCreated',
      'MAX(t.dateAdded)       as dateAdded',
      'MAX(t.dateLastPlayed)  as dateLastPlayed'])
      .leftJoin(AlbumArtwork, 'a', 't.albumKey = a.albumKey')
      .where('(t.albumKey IS NOT NULL AND t.albumKey <> \'\')')
      .andWhere('(t.albumKey NOT IN (SELECT albumKey FROM album_artwork) OR t.needsAlbumArtworkIndexing = 1)')
      .groupBy('t.albumKey')
      .getRawMany()
    return albumData as AlbumData[]
  }

  public getLastModifiedTrackForAlbumKeyAsync(albumKey: string) {
    return this.trackRepo.findOneBy({ albumKey })
  }

  public disableNeedsAlbumArtworkIndexingAsync(albumKey: string) {
    return this.trackRepo
      .createQueryBuilder()
      .update()
      .set({ needsAlbumArtworkIndexing: 0 })
      .where('albumKey = :albumKey', { albumKey })
      .execute()
  }

  public async getTrackArtistData() {
    const res = await this.trackRepo
      .createQueryBuilder('t')
      .select(['DISTINCT t.artists as artists', 't.albumKey as albumKey', 'a.artworkId as artworkId'])
      .innerJoin(FolderTrack, 'ft', 'ft.trackID = t.trackId')
      .innerJoin(Folder, 'f', 'ft.folderId = f.folderId')
      .leftJoin(AlbumArtwork, 'a', 't.albumKey = a.albumKey')
      .where('t.indexingSuccess = :indexingSuccess', { indexingSuccess: 1 })
      .andWhere('t.needsIndexing = :needsIndexing', { needsIndexing: 0 })
      .getRawMany()
    return res as ArtistData[]
  }

  public async getAlbumArtistData() {
    const res = await this.trackRepo
      .createQueryBuilder('t')
      .select('DISTINCT t.albumArtists', 'artists')
      .innerJoin(FolderTrack, 'ft', 'ft.trackID = t.trackId')
      .innerJoin(Folder, 'f', 'ft.folderId = f.folderId')
      .where('t.indexingSuccess = :indexingSuccess', { indexingSuccess: 1 })
      .andWhere('t.needsIndexing = :needsIndexing', { needsIndexing: 0 })
      .getRawMany()

    return res as ArtistData[]
  }
}
