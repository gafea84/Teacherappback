const path   = require('path');
const fs     = require('fs');
const multer = require('multer');

const avatarsDir          = path.join(process.cwd(), './public/images/avatars');
const validFileExtensions = [ '.apng', '.avif', '.gif', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.webp']
const upload              = multer({ dest: path.join(avatarsDir + '/tmp') });

const checkUserImage = (file) => {
    return checkUserImageAux(
        file.path,
        path.extname(file.originalname).toLowerCase()
    );
}

const checkUserImageAux = (tmpFile, fileExtension) => {
    if (!validFileExtensions.includes(fileExtension)) {
        fs.unlinkSync(tmpFile);

        return {
            ok: false,
            statuscode: 400,
            messageError: 'Tipo de fichero incorrecto'
        }
    } else {
        return {
            ok: true
        }
    }
}

const userImage = (id, file) => {
    try {
        const tmpFile       = file.path;
        const fileExtension = path.extname(file.originalname).toLowerCase();

        const resultCheck = checkUserImageAux(tmpFile, fileExtension);
        if (!resultCheck.ok) {
            return resultCheck;
        }

        const fileName   = `${id}${fileExtension}`;
        const targetFile = path.join(avatarsDir, fileName);
        fs.renameSync(tmpFile, targetFile);

        return { 
            ok: true,
            fileName
        };

    } catch(exception) {
        return {
            ok: false,
            statuscode: 500,
            messageError: exception.message
        }

    }
}

const deleteTmpImage = (file) => {
    try {
        const tmpFile = file.path;
        if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
        }
    } catch(exception) {
        // ¿Qué hacemos aquí?
    }
}

module.exports = { upload, userImage, checkUserImage, deleteTmpImage };