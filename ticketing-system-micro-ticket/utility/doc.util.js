


const validateDocuments = (docFiles) => {
    try {

        const allowedExt = ["png", "jpeg", "jpg", 'pdf']
        const allowedFiles = ["image/png", "image/jpeg", , "image/jpg", "application/pdf"];

        for (const doc of docFiles) {
            const fileName = doc.name;
            if (fileName && fileName.split(".").length > 2) {
                return false
            }

            const [imageName, fileExt] = fileName.split(".");
            const fileContentType = doc.mimetype;

            if (!allowedFiles.includes(fileContentType) || !allowedExt.includes(fileExt.toLowerCase())) {
                return false
            }

        }

        return true

    } catch (error) {
        throw error
    }
}

module.exports = {
    validateDocuments
}