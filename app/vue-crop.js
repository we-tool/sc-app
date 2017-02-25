;$(function() {

  if (!$.Jcrop) {
    console.error('Uncaught ReferenceError: Jcrop is not defined')
    return
  }

  var vueCrop = {}
  var options = {}
  var events = [
    'create',
    'start',
    'move',
    'end',
    'focus',
    'blur',
    'remove'
  ]

  vueCrop.install = function(Vue) {

    Vue.directive('crop', {

      acceptStatement: true,

      // https://vuejs.org/v2/guide/custom-directive.html
      bind: function(el, binding) {
        var event = binding.argument

        console.log('this', this)

        if ($.inArray(event, events) == -1) {
          console.warn('Invalid v-crop event: ' + event)
          return
        }

        if (this.vm.jcrop) return

        var $wrapper = $(el).wrap('<div/>').parent()

        $wrapper.width(el.width).height(el.height)

        this.vm.jcrop = $.Jcrop.attach($wrapper, options)
      },

      update: function(el, binding) {
        var event = binding.argument
        var callback = binding.value
        this.vm.jcrop.container.on('crop' + event, callback)
      },

      unbind: function(el, binding) {
        var event = binding.argument
        this.vm.jcrop.container.off('crop' + event)

        if (this._watcher.id != 1) return

        this.vm.jcrop.destroy()
        this.vm.jcrop = null
      }
    })
  }

  vueCrop.setOptions = function(opts) {
    options = opts
  }

  if (window.Vue) {
    window.VueCrop = vueCrop
    Vue.use(vueCrop)
  }

}());
