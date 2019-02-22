Component({

  properties: {
    course: {
      type: Object,
      value: {
        "color": 0,
        "weekday": 2,
        "start": 1,
        "last": 3,
        "weeks": "1-16周",
        "course_name": "传入course数据"
      }
    }
  },

  data: {
    colors: ["#86b0fe", "#71eb55", "#f7c156", "#76e9eb", "#ff9dd8", "#80f8e6", "#eaa5f7", "#86b3a5", "#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#29ab97", "#61BC69", "#12AEF3", "#E29AAD", "#AFD7A4", "#F1BBB9", "#A0A8AE", "#AD918C"],
  },

  methods: {
  },

  lifetimes: {
    created: function() {},
    attached: function() {},
  }

})