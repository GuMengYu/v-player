export class QueryParts {
  public static selectTrackArtistsQueryPart(onlyVisibleArtists: boolean): string {
    let selectTrackArtistsQueryPart: string = 'SELECT DISTINCT t.Artists as artists FROM Track t'

    if (onlyVisibleArtists)
      selectTrackArtistsQueryPart += ` ${  this.folderJoins()}`


    return selectTrackArtistsQueryPart
  }

  public static selectAlbumArtistsQueryPart(onlyVisibleArtists: boolean): string {
    let selectAlbumArtistsQueryPart: string = 'SELECT DISTINCT t.AlbumArtists as artists FROM Track t'

    if (onlyVisibleArtists)
      selectAlbumArtistsQueryPart += ` ${  this.folderJoins()}`


    return selectAlbumArtistsQueryPart
  }

  public static selectGenresQueryPart(onlyVisibleGenres: boolean): string {
    let selectGenresQueryPart: string = 'SELECT DISTINCT t.Genres as genres FROM Track t'

    if (onlyVisibleGenres)
      selectGenresQueryPart += ` ${  this.folderJoins()}`


    return selectGenresQueryPart
  }

  public static selectAlbumDataQueryPart(onlyVisibleAlbumData: boolean): string {
    let selectAlbumDataQueryPart: string = `SELECT t.albumTitle AS albumTitle,
                                                       t.albumArtists AS albumArtists,
                                                       t.albumKey AS albumKey,
                                                       a.artworkID as artworkId,
                                                       MAX(t.artists) AS artists,
                                                       MAX(t.year) AS year,
                                                       GROUP_CONCAT(distinct t.genres) AS genres,
                                                       MAX(t.dateFileCreated) AS dateFileCreated,
                                                       MAX(t.dateAdded) AS dateAdded,
                                                       MAX(t.dateLastPlayed) AS dateLastPlayed FROM track t
                                                       LEFT JOIN album_artwork a ON t.albumKey=a.albumKey`

    if (onlyVisibleAlbumData)
      selectAlbumDataQueryPart += ` ${  this.folderJoins()}`


    return selectAlbumDataQueryPart
  }

  public static selectTracksQueryPart(onlyVisibleTracks: boolean): string {
    let selectTracksQueryPart: string = `SELECT DISTINCT t.TrackID AS trackId,
                                                             t.Artists AS artists,
                                                             t.Genres AS genres,
                                                             t.AlbumTitle AS albumTitle,
                                                             t.AlbumArtists AS albumArtists,
                                                             t.AlbumKey AS albumKey,
                                                             t.AlbumKey2 AS albumKey2,
                                                             t.AlbumKey3 AS albumKey3,
                                                             t.Path AS path,
                                                             t.FileName AS fileName,
                                                             t.MimeType AS mimeType,
                                                             t.FileSize AS fileSize,
                                                             t.BitRate AS bitRate,
                                                             t.SampleRate AS sampleRate,
                                                             t.TrackTitle AS trackTitle,
                                                             t.TrackNumber AS trackNumber,
                                                             t.TrackCount AS trackCount,
                                                             t.DiscNumber AS discNumber,
                                                             t.DiscCount AS discCount,
                                                             t.Duration AS duration,
                                                             t.Year AS year,
                                                             t.HasLyrics AS hasLyrics,
                                                             t.DateAdded AS dateAdded,
                                                             t.DateFileCreated AS dateFileCreated,
                                                             t.DateLastSynced AS dateLastSynced,
                                                             t.DateFileModified AS dateFileModified,
                                                             t.NeedsIndexing AS needsIndexing,
                                                             t.NeedsAlbumArtworkIndexing AS needsAlbumArtworkIndexing,
                                                             t.IndexingSuccess AS indexingSuccess,
                                                             t.IndexingFailureReason AS indexingFailureReason,
                                                             t.Rating AS rating,
                                                             t.Love AS love,
                                                             t.PlayCount AS playCount,
                                                             t.SkipCount AS skipCount,
                                                             t.DateLastPlayed AS dateLastPlayed
                                                             FROM Track t`

    if (onlyVisibleTracks)
      selectTracksQueryPart += ` ${  this.folderJoins()}`


    return selectTracksQueryPart
  }

  private static folderJoins(): string {
    return `INNER JOIN folder_track ft ON ft.trackID = t.trackID
                INNER JOIN folder f ON ft.folderID = f.folderID
                WHERE t.indexingSuccess = 1 AND t.needsIndexing = 0`
  }
}
