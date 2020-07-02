import SyncStorage from 'sync-storage';

export const getBasicUri = (image, url) => {
  const apiUrl = SyncStorage.get('apiUrl');

  return apiUrl + '/api/image/' + image;
}
