/**
 * Returns an array of files under the folder with the specified ID. Returns null in case of an acquisition error.
 * @param {string} folderId Target folder ID.
 * @return {Object[]} file objects.
 */
function getFilesArrayByFolderId(folderId){
  const targetFolder = getFolder(folderId);
  if (targetFolder === null){
    return null;
  }
  let fileList = [];
  const files = targetFolder.getFiles();
  while (files.hasNext()){
    fileList.push(files.next());
  }
  return fileList;
}
/**
 * Returns the folder with the specified ID. Returns null in case of an acquisition error.
 * @param {string} folderId Target folder ID.
 * @return {Object} folder object.
 */
function getFolder(folderId){
  try{
    DriveApp.getFolderById(folderId);
  } catch(error){
    return null;
  }
  return DriveApp.getFolderById(folderId);
}
/**
 * @param none.
 * @return {string} For example '20230310_1435'.
 */
function todayYyyymmdd(){
  return Utilities.formatDate(new Date(), 'JST', 'yyyyMMdd_HHmm');
}
/**
 * Creates a folder under the folder with the specified ID and returns the created folder. 
 * If the parent folder fails to be obtained, null is returned.
 * @param {string} folderId Target folder ID.
 * @param {string} folderName Name of the folder to be created.
 * @return {Object} The folder object.
 */
function createFolder(folderId, folderName=todayYyyymmdd()){
  const parentFolder = getFolder(folderId);
  if (parentFolder === null){
    return null;
  }
  return parentFolder.createFolder(folderName);
}
/**
 * Move old files.
 * @param {Object} fromFolder The folder from which to move.
 * @param {Object} toFolder The destination folder.
 * @return none.
 */
function saveFiles(fromFolder, toFolder){
  const oldFiles = fromFolder.getFiles();
  while (oldFiles.hasNext()){
    const file = oldFiles.next();
    file.moveTo(toFolder);
  } 
}
/**
 * Get the files by MimeType.
 * @param {Object} targetFolder Target folder.
 * @param {number} mimeType MimeType of the file to be searched.
 * @return {Object} The file objects. 
 */
function getFilesByMimeType(targetFolder, mimeType=MimeType.GOOGLE_SHEETS){
  return targetFolder.getFilesByType(mimeType);
}
/**
 * Get the latest file.
 * @param {Object} targetFolder folder object.
 * @param {boolean} targetFlag If true, target folders; if false, target files.
 * @return {string} The latest file Id. 
 */
function getLastUpdated(targetFolder, targetFlag=true){
  let lastUpdate = [];
  const targetObject = targetFlag ? targetFolder : targetFolder.getFiles();
  while (targetObject.hasNext()){
    const target = targetObject.next();
    lastUpdate.push([target.getId(), target.getLastUpdated(), target.getName()]);
  }
  const sortFile = lastUpdate.sort((x, y) => new Date(y[1]) - new Date(x[1]));
  return sortFile[0][0];
}
