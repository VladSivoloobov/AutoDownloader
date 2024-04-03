export default class FileName {
    static getFileWithoutExtension(fileName){
        return fileName.slice(0, fileName.lastIndexOf("."));
    }

    static getFileExtension(fileName){
        return fileName.slice(fileName.lastIndexOf("."), fileName.length);
    }
}