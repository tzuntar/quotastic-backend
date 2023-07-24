import * as fs from 'fs';
import { extname } from 'path';
import { diskStorage, Options } from 'multer';

const FileType = import('file-type');

export class LocalFilestore {

    private static readonly validImageExtesions = ['png', 'jpg', 'jpeg'];
    private static readonly validImageMimes = ['image/png', 'image/jpg', 'image/jpeg'];

    static readonly storeImageFile: Options = {
        storage: diskStorage({
            destination: './filestore',
            filename(req, file, callback) {
                const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `${uniqueName}${ext}`);
            },
        }),
        fileFilter(req, file, callback) {
            LocalFilestore.validImageMimes.includes(file.mimetype)
                ? callback(null, true)
                : callback(null, false);
        },
    };

    static async verifyImageFile(fullPath: string): Promise<boolean> {
        return (await FileType).fileTypeFromFile(fullPath)
            .then(extAndMimeType => {
                if (!extAndMimeType?.ext || !extAndMimeType?.mime) return false;
                return this.validImageExtesions.includes(extAndMimeType.ext)
                    && this.validImageMimes.includes(extAndMimeType.mime);
            });
    }

    static unlink(fullPath: string) {
        fs.unlink(fullPath, (error) => {
            if (error) console.log(`Deleting file at ${fullPath} failed: ` + error);
            console.log(`Deleted file at ${fullPath}`);
        });
    }


}