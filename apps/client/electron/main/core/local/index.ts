import { bootstrap } from '../../../../../service/src/main'
export async function useLocalLibraryService() {
  return await bootstrap()
}
