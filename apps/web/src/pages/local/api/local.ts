import { localRequest, localPost } from '@/util/fetch'
import { LocalArtist } from '../hooks/useQueryArtist';
export async function indexing() {
  return localRequest('base/indexing') as any
}
export async function allFolder() {
  return localRequest<{
    folders: []
    count: number
  }>('base/all-folder');
}

export async function openPath(path: string) {
  return localPost('base/open-path',  { path })
}

// add folder
export async function addFolder(path: string) {
  return localPost('base/add-folder',{ path } )
}

// remove folder
export async function removeFolder(folderId: number) {
  return localPost('base/remove-folder', { folderId } )
}

// open in explorer
// base/show-file-in-dir
export async function openInExplorer(path: string) {
  return localPost('base/show-file-in-dir', { path })
}
// all album
// album/all-albums
export async function getAllAlbums() {
  return localRequest('album/all-albums')
}
// get album 
// album/artist-albums
export async function getAlbumsByArtist(artistName: string) {
  return localPost('album/artist-albums',  { artistName })
}

// get artists
// artist/all-artists
export async function getAllArtists() {
  return localRequest<LocalArtist[]>('artist/all-artists')
}

// get all tracks
// track/all-tracks
export async function getAllTracks() {
  return localRequest<{
    data: any, totalDt: number, totalSize: number
  }>('track/all-tracks')
}

// track/liked-tracks
export async function getAllLikedTracks() {
  return localRequest<{
    data: any, totalDt: number, totalSize: number
  }>('track/liked-tracks')
}

// track/get-playlist-tracks
export async function getPlaylistTracks(id: number) {
  return localRequest<{
    data: any, totalDt: number, totalSize: number
  }>('track/get-playlist-tracks', { params: { id } })
}

export async function toggleTrackLike(trackId: number, liked: boolean) {
  return localPost('track/toggle-track-like', {trackId, liked})
}


export function createPlaylist(name: string) {
  return localPost('playlist/add-playlist', { name })
}

export function getPlayList() {
  return localRequest<[]>('playlist/all-playlist')
}

export function deletePlayList(id: number) {
  return localPost('playlist/delete-playlist', { id })
}

export function addTrackToPlaylist(trackId: number, playlistId: number) {
  return localPost('playlist/add-track', {trackId, playlistId})
}

export function removeTrackFromPlaylist(trackId: number, playlistId: number) {
  return localPost('playlist/remove-track', {trackId, playlistId})
}
export function renamePlaylist(playlistId: number, newName: string) {
  return localPost('playlist/rename-playlist', {playlistId, newName})
}

export async function getLocalTrack(id: number) {
  return localRequest('track/get-track', { params: { id } })
}

export async function getLocalAlbumTrack(albumKey: string) {
  return localRequest('track/get-album-tracks', {params: { albumKey }})
}
