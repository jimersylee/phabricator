/**
 * @provides phabricator-diff-path-view
 * @requires javelin-dom
 * @javelin
 */

JX.install('DiffPathView', {

  construct: function() {
  },

  members: {
    _node: null,
    _path: null,
    _depth: 0,
    _selected: false,
    _focused: false,
    _icon: null,

    _indentNode: null,
    _pathNode: null,
    _changeset: null,
    _inlineNode: null,
    _isDirectory: false,
    _displayPath: null,

    getNode: function() {
      if (!this._node) {
        var attrs = {
          className: 'diff-tree-path'
        };

        this._node = JX.$N('li', attrs, this._getIndentNode());

        var onclick = JX.bind(this, this._onclick);
        JX.DOM.listen(this._node, 'click', null, onclick);
      }
      return this._node;
    },

    getIcon: function() {
      if (!this._icon) {
        this._icon = new JX.PHUIXIconView();
      }
      return this._icon;
    },

    setPath: function(path) {
      this._path = path;
      this._redrawPath();
      return this;
    },

    setDisplayPath: function(path) {
      this._displayPath = path;
      this._redrawPath();
      return this;
    },

    setIsDirectory: function(is_directory) {
      this._isDirectory = is_directory;
      this._redrawPath();
      return this;
    },

    setChangeset: function(changeset) {
      this._changeset = changeset;

      var node = this.getNode();
      JX.DOM.alterClass(node, 'diff-tree-path-changeset', !!changeset);

      return this;
    },

    getChangeset: function() {
      return this._changeset;
    },

    getPath: function() {
      return this._path;
    },

    setHidden: function(hidden) {
      this._hidden = hidden;

      var node = this.getNode();
      if (this._hidden) {
        JX.DOM.hide(node);
      } else {
        JX.DOM.show(node);
      }

      return this;
    },

    setDepth: function(depth) {
      this._depth = depth;

      this._getIndentNode().style.marginLeft = (8 * this._depth) + 'px';

      return this;
    },

    setIsSelected: function(selected) {
      this._selected = selected;

      var node = this.getNode();
      JX.DOM.alterClass(node, 'diff-tree-path-selected', this._selected);

      return this;
    },

    setIsFocused: function(focused) {
      this._focused = focused;

      var node = this.getNode();
      JX.DOM.alterClass(node, 'diff-tree-path-focused', this._focused);

      return this;
    },

    _onclick: function(e) {
      if (!e.isNormalClick()) {
        return;
      }

      var changeset = this.getChangeset();
      if (changeset) {
        changeset.select(true);
      }

      e.kill();
    },

    _getIndentNode: function() {
      if (!this._indentNode) {
        var attrs = {
          className: 'diff-tree-path-indent'
        };

        var content = [
          this.getInlineNode(),
          this._getIconNode(),
          this._getPathNode(),
        ];

        this._indentNode = JX.$N('div', attrs, content);
      }

      return this._indentNode;
    },

    _getPathNode: function() {
      if (!this._pathNode) {
        var attrs = {
          className: 'diff-tree-path-name'
        };
        this._pathNode = JX.$N('div', attrs);
      }
      return this._pathNode;
    },

    _getIconNode: function() {
      if (!this._iconNode) {
        var attrs = {
          className: 'diff-tree-path-icon',
        };
        this._iconNode = JX.$N('div', attrs, this.getIcon().getNode());
      }
      return this._iconNode;
    },

    getInlineNode: function() {
      if (!this._inlineNode) {
        var attrs = {
          className: 'diff-tree-path-inlines',
        };
        this._inlineNode = JX.$N('div', attrs, '-');
      }
      return this._inlineNode;
    },

    _redrawPath: function() {
      var display;
      if (this._displayPath) {
        display = this._displayPath;
      } else {
        display = this._path[this._path.length - 1];
      }

      var is_directory = this._isDirectory;

      if (is_directory) {
        display = display + '/';
      }

      JX.DOM.setContent(this._getPathNode(), display);
    }

  }

});
