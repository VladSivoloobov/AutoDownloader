#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import FileName from "./FileName.js";
import sharp from "sharp";

const cwd = process.cwd();
const homedir = os.homedir();
const downloadsPath = path.resolve(homedir, "Downloads");

function start() {
    const configFile = getConfigFile();
    watchDownloadsFolder(configFile);
}

function getConfigFile(){
    try{
        const file = fs.readFileSync(path.resolve(cwd, "autodownloader.json"));
        const bufferString = file.toString();
        return JSON.parse(bufferString);
    }
    catch {
        return setDefaultConfig();
    }
}

function watchDownloadsFolder(configJson){
    fs.watch(downloadsPath, (e, filename) => {
        if(e !== "change") return;

        const fileExtension = FileName.getFileExtension(filename);
        const savePath = configJson[fileExtension];
        if(!savePath) return;

        saveFileInFolder(savePath, filename);
    });
}

function saveFileInFolder(folder, filename){
    const fileBuffer = fs.readFileSync(path.resolve(downloadsPath, filename));

    const destinationPath = path.resolve(cwd, folder);

    if(!fs.existsSync(destinationPath)) {
        fs.mkdirSync(path.resolve(cwd, folder), { recursive: true });
    }

    try{
        if(convertImage(filename, fileBuffer, destinationPath)) return;
        fs.writeFileSync(path.resolve(destinationPath, filename), fileBuffer, {
            flag: "w"
        });
    }
    catch (e){
        console.log("Не удалось создать файл в точке назначения", e.message);
    }
}

function convertImage(imageName, imageBuffer, imageDestination){
    if([
        ".png",
        ".webp",
        ".jpg",
        ".jpeg"
    ].includes(FileName.getFileExtension(imageName))){
        sharp(imageBuffer)
            .resize(1500)
            .webp()
            .toFile(path.resolve(imageDestination, FileName.getFileWithoutExtension(imageName) + ".webp"),
                (err, info) => {
                if(err){
                    console.error(err);
                }

                console.log(info);
            })
        return true;
    } else {
        return false;
    }
}

function setDefaultConfig(){

}

start();