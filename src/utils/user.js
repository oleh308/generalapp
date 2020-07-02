import SyncStorage from 'sync-storage';

export const getImageUri = (image, url) => {
  const apiUrl = SyncStorage.get('apiUrl');

  if (image) {
    return apiUrl + '/api/image/' + image;
  } else {
    return "https://via.placeholder.com/200x200";
  }
}

export const getName = (user) => {
  if (user) {
    let fullName = user.name ? user.name : '';
    fullName = fullName ? fullName + ' ' + user.surname : user.surname;

    return fullName;
  } else {
    return ''
  }
}
