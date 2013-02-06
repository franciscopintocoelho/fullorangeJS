/***** COMMENTS TO BE ADDED LATER *****/
(function(window) {

	"use strict";

	// Alias the libraries from the global object.
	var Backbone = window.Backbone;
	var _ = window._;
	var $ = window.$;

	var FullOrange;
	if (typeof exports !== 'undefined') {
		FullOrange = exports;
	} else {
		FullOrange = window.FullOrange = {};
	}

	var _configure = Backbone.View.prototype._configure;

	/***** VIEW CONTROLLER *****/
	FullOrange.ViewController = Backbone.View.extend({
		views: [],

		currentView: null,

		_setup: function(params) {
			this.deeplink = params.deeplink ?  params.deeplink : '';
		},

		_configure: function(options) {
	  		// Run the original _configure.
	  		var retVal = _configure.apply(this, arguments);

	  		if(options.library) {
	  			this.library = options.library;
	  			if(this.template) this.library.add(this.template);
	  			console.log(this.library);
	  		}
	  		
	  		_.bindAll(this);
	  		this._setup.apply(this, arguments);

		  	return retVal;
		},

		_changeView: function(id, path) {
			if(!id) id = '';

			if(!this.views[id]) return;

			var deeplink = path ? path.split('/') : [];

			if(this.currentView && id == this.currentView.id) {
				this.currentView._openSubView(deeplink);
			}
			else {
				if(this.currentView) this.oldView = this.currentView;
				this.currentView = new this.views[id]( { id: id, deeplink: deeplink, library: this.library } );
				this._ensureCurrentRemoved();
			}
		},

		_onViewRemoved: function() {
			if(this.oldView) this.oldView = null;

			if(this.currentView) {
				if(this.container) this.$el.find(this.container).html(this.currentView.render().$el);
				else this.$el.html(this.currentView.render().$el);
				this.currentView.show();
			}
		},

		_ensureCurrentRemoved: function() {
			if(this.oldView) {
				this.oldView.on('onHidden', this._onViewRemoved);
				this.oldView.remove();
			}
			else { this._onViewRemoved(); }
		},

		_openSubView: function(deeplink) {
			if(deeplink.length > 1) {
				this._changeView(deeplink[1], _.rest(deeplink, 1).join('/') );
			} else { 
				if(this.currentView) {
					this.oldView = this.currentView;
					this.currentView = null;
				}
				this._ensureCurrentRemoved();
			}
		},

		show: function() { this.onShown(); },

		hide: function() { this.onHidden(); },

		onShown: function() {
			this._openSubView(this.deeplink);
			this.trigger('onShown');
		},

		onHidden: function() { 
			this.$el.remove();
			this.$el.unbind();

			this.trigger('onHidden');
		},

		render: function() {
			var view = this;

			this.library.get(this.template, function(tmpl) {
				view.$el.html(tmpl);
			});

			return this;
		},

		remove: function() {
			if(this.currentView) {
				this.currentView.on('onHidden', this.hide);
				this.currentView.remove();
			}
			else this.hide();
		}

	});

	/***** VIEW *****/
	FullOrange.View = FullOrange.ViewController.extend({
		asset: null
	});

	/***** TEMPLATE LIBRARY *****/
	FullOrange.TemplateLibrary = function() { };

	_.extend(FullOrange.TemplateLibrary.prototype, {
		templates: { },

		add: function(template) {
			if(!this.templates[template]) {
				this.templates[template] = { path: template, compiled: null };
			}
		},

		get: function(attr, callback) {
			var obj = this.templates[attr];

			if(!obj) return;
			if(obj.compiled) return callback(obj.compiled);
					
			$.get(obj.path, function(contents) {
				var tmpl = _.template(contents);
			    obj.compiled = tmpl;
			    callback(tmpl);
			});
		}
	});

	/***** APPLICATION *****/
	FullOrange.Application = FullOrange.ViewController.extend({
		library: new FullOrange.TemplateLibrary,
		router: new Backbone.Router,

		_setup: function(params) {
			this.router.route('', '', this._changeView);
			this.router.route(':view*path', '', this._changeView);
		}
	});

})(this);