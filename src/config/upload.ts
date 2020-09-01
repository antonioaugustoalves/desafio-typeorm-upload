import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmp_folder = path.resolve(__dirname,'..','..','tmp');
export default{
    directory: tmp_folder,
    storage:multer.diskStorage({
        destination:tmp_folder,
        filename(request, file, callback){
            const fileHash = crypto.randomBytes(12).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        }
    }),
}