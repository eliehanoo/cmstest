const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const {isEmpty} = require('../config/customFunctions');

module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },


    /* ADMIN POSTS ENDPOINTS */


    getPosts: (req, res) => {
        Post.find().lean()
            .populate('category')
            .then(posts => {
                res.render('admin/posts/index', {posts: posts});
            });
    },


    createPostsGet: (req, res) => {
        Category.find().lean().then(cats => {

            res.render('admin/posts/create', {categories: cats});
        });


    },

    submitPosts: (req, res) => {

        const commentsAllowed = req.body.allowComments ? true : false;

        // Check for any input file
        let filename = '';
        
       if(!isEmpty(req.files)) {
           let file = req.files.uploadedFile;
           filename = file.name;
           let uploadDir = './public/uploads/';
           
           file.mv(uploadDir+filename, (err) => {
               if (err)
                   throw err;
           });
       }
        
        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });

        newPost.save().then(post => {
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });


    },


    editPostGetRoute: (req, res) => {
        const id = req.params.id;

        Post.findById(id).lean()
            .then(post => {

                Category.find().lean().then(cats => {
                    res.render('admin/posts/edit', {post: post, categories: cats});
                });


            })
    },

    editPostUpdateRoute: async (req, res) => {
        const commentsAllowed = req.body.allowComments ? true : false;

        let filename = req.body.currentImg;
        
        if(!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            
            file.mv(uploadDir+filename, (err) => {
                if (err){
                    throw err;
                    console.log(err)
                }
                   
            });
            filename = `/uploads/${filename}`;
        }

let edit;
    
try{
    edit = await Post.findById(req.params.id);
   edit.title = req.body.title;
   edit.status = req.body.status;
   edit.allowComments = commentsAllowed;
   edit.description = req.body.description;
   edit.category = req.body.category;
   edit.file = filename;
await   edit.save().then(updatePost => {
    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
    res.redirect('/admin/posts');

});
  
}catch(e){
edit == null ? res.redirect('/') : res.render('/admin/posts',{edit : edit,errorMessage : 'Error Updating Author'});

}
},
        

    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id).lean()
            .then(deletedPost => {
                req.flash('success-message', `The post ${req.params.id} has been deleted.`);
                res.redirect('/admin/posts');
            });
    },


    /* ALL CATEGORY METHODS*/
    getCategories: (req, res) => {

        Category.find().lean().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;

        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }

    },

    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find().lean();


        Category.findById(catId).lean().then(cat => {

            res.render('admin/category/edit', {category: cat, categories: cats});

        });
    },


    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).lean().then(category => {

                category.title = newTitle;

                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                });

            });
        }
    }


};    
    
