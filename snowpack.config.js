module.exports = {
  mount:{
    public: {url:'/',static: true},
    src: {url:'/dist'}
  },
  optimize:{
    miify:true,
  },
  plugins:[
    '@snowpack/plugin-sass'
  ]
}