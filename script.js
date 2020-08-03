
//过滤时间
Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))

// New VueJS instance
new Vue({
  name: 'notebook',

  // vue实例挂载的元素
  el: '#notebook',

  data () {
    return {
      // 渲染页面 加载缓存中数据
      notes: JSON.parse(localStorage.getItem('notes')) || [],
	  //是否上一次有选中
      selectedId: localStorage.getItem('selected-id') || null,
    }
  },

 
  computed: {
	  //点击选中 返回选中笔记
    selectedNote () {
      return this.notes.find(note => note.id === this.selectedId)
    },

    notePreview () {
     //展示
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },
// 创建时间越早越在前  点击收藏放在列表前面 
    sortedNotes () {
      return this.notes.slice().sort((a, b) => a.created - b.created)
	  //0 位置不变 1 a在b后面 -1 a在b的前面
      .sort((a, b) => (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1)
    },

    linesCount () {
      if (this.selectedNote) {
       //统计行数
        return this.selectedNote.content.split(/\r\n|\r|\n/).length
      }
    },
  //统计字数
    wordsCount () {
      if (this.selectedNote) {
        var s = this.selectedNote.content
        s = s.replace(/\n/g, ' ')
        s = s.replace(/(^\s*)|(\s*$)/gi, '')
        s = s.replace(/[ ]{2,}/gi, ' ')
        return s.split(' ').length
      }
    }
  },

  watch: {
    notes: {
      handler: 'saveNotes',
      //监听数组中的每一项的对象属性的具体变化
      deep: true,
    },
    //缓存选中的笔记
    selectedId (val, oldVal) {
      localStorage.setItem('selected-id', val)
    },
  },

  methods:{
    // 添加笔记
    addNote () {
      const time = Date.now()
      // Default new note
      const note = {
        id: String(time),
        // title: '笔记' + (this.notes.length + 1),
        content: '来来来~记录学习咯',
        created: time,
		order:this.notes.length + 1,
        favorite: false,
      }
      // 添加
      this.notes.push(note)
      //选中
      this.selectNote(note)
    },

    // 删除
    removeNote () {
      if (this.selectedNote && confirm('Delete the note?')) {
        const index = this.notes.indexOf(this.selectedNote)
       let length = this.notes.length;
       if (index == -1) {
       	return
       }
       if (index + 1 < length) {
       	// 修改i后面的选中的序号 减1就行
       	for (let j = index; j < length; j++) {
       		console.log(this.notes[j])
       		this.notes[j].order--
       	}
       }
       this.notes.splice(index, 1)
		
      }
    },

    selectNote (note) {
      this.selectedId = note.id
    },

    saveNotes () {
      // 不要忘记localStorage存放的是字符串
      localStorage.setItem('notes', JSON.stringify(this.notes))
      console.log('Notes saved!', new Date())
    },
    //选中取消收藏
    favoriteNote () {
      this.selectedNote.favorite = !this.selectedNote.favorite
    },
  },
})
