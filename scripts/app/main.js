(function() {
	/* TESTING THE FRAMEWORK */

	var subsubview0 = FullOrange.View.extend({
		
		className: 'subsubview',

		template: 'templates/subsubview.html',

		show: function() {
			this.$el.animate( { top: '0' }, 500, this.onShown );
		},

		hide: function() {
			this.$el.animate( { top: '-200px' }, 500, this.onHidden );
		}
	});

	var subview0 = FullOrange.View.extend({
		container: '#subsubview',

		className: 'subview',

		template: 'templates/subview.html',

		views: {
			'subsubview0': subsubview0,
			'subsubview1': subsubview0,
			'subsubview2': subsubview0
		},

		show: function() {
			this.$el.animate( { left: '0' }, 500, this.onShown );
		},

		hide: function() {
			this.$el.animate( { left: '-600px' }, 500, this.onHidden );
		}

	});

	var view0 = FullOrange.View.extend({
		container: '#subview',

		className: 'view',

		template: 'templates/view.html',

		views: {
			'subview0': subview0,
			'subview1': subview0,
			'subview2': subview0
		},

		show: function() {
			this.$el.animate( { opacity: 1 }, 500, this.onShown );
		},

		hide: function() {
			this.$el.animate( { opacity: 0 }, 500, this.onHidden );
		}

	});

	var MyApplication = FullOrange.Application.extend( {
		el: '.app-view',

		views: { 
			'': view0,
			'view0': view0, 
			'view1': view0, 
			'view2': view0 
		}
	});

	$(document).ready(function(){
		var myapp = new MyApplication;
		Backbone.history.start();
	});
	
})();