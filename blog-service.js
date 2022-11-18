const Sequelize = require('sequelize');

var sequelize = new Sequelize('d3mhmpvgv2ervn', 'rlyzcysixdgphp', '242e1a1e92e0ff7e645b0751ae07deb8f2d8d7af9866bf5e0095fe5d90d08137', {
    host: 'ec2-107-22-122-106.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'})

module.exports.initialize = function () {
    return sequelize.sync()
}

module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll().then(data=>{
            resolve(data);
        }).catch( err =>{
            reject("no results returned");
        });
    });
}

module.exports.getPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getPostsByMinDate = function (minDateStr) {

    const { gte } = Sequelize.Op;

    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                  }
            }
        }).then( data => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.getPostById = function (id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        }).then( data => {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.addPost = function (postData) {
    return new Promise((resolve, reject) => {
        postData.published = postData.published ? true : false;

        for (var prop in postData) {
            if (postData[prop] === '')
            postData[prop] = null;
        }

        postData.postDate = new Date();

        Post.create(postData).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to create post");
        });

    });
}

module.exports.deletePostById = function (id) {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        }).then( data => {
            resolve();
        }).catch(() => {
            reject("unable to delete post");
        });
    });
}

module.exports.getPublishedPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data=>{
            resolve(data);
        }).catch( err =>{
            reject("no results returned")
        });
    });
}

module.exports.addCategory = function (categoryData) {
    return new Promise((resolve, reject) => {

        for (var prop in categoryData) {
            if (categoryData[prop] === '')
            categoryData[prop] = null;
        }

        Category.create(categoryData).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to create category");
        });

    });
}

module.exports.deleteCategoryById = function (id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        }).then( data => {
            resolve();
        }).catch(() => {
            reject("unable to delete category");
        });
    });
}

