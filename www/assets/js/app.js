var vm = function() {
  var self = this;

  self.canUndo = ko.observable(false);

  self.notes = ko.observableArray([]);

  self.note = {
    body: ko.observable(''),
    author: ko.observable('Cayce Pollard'),
    date: ko.observable( 'a few seconds ago' ),
    location: ko.observable('Edmonton'),
    attachments: ko.observableArray([]),
    hasPreview: ko.observable(false),
    isEditing: ko.observable(false),
    isAttaching: ko.observable(false),
    isExpanded: ko.observable(false),
    isDeleted: ko.observable(false)
  };

  self.expandNewNote = function() {
    if ( self.note.isExpanded() == false ) {
      self.note.isExpanded( true );
      $('.new-note-input').focus();
    }
  };

  self.addNewAttachment = function() {
    self.note.attachments.unshift({
      name: ko.observable('example.pdf'),
      type: ko.observable('PDF'),
      href: ko.observable('/assets/pdf/example.pdf'),
      thumbnail: ko.observable('http://placehold.it/64x64')
    });
  };

  self.removeNewAttachment = function(attachment) {
    self.note.attachments.remove(attachment);
  };

  self.removeAttachment = function(attachment, event) {
    $(event.target).parent().parent().hide();
  };

  self.postNote = function() {
    var newNote = function() {
      var note = this;

      note.body = ko.observable( self.note.body().replace(/(?:\r\n|\r|\n)/g, '<br />') );
      note.author = ko.observable( self.note.author() );
      note.date = ko.observable( self.note.date() );
      note.location = ko.observable( self.note.location() );
      note.attachments = ko.observableArray( self.note.attachments() );
      note.isEditing = ko.observable(false);
      note.isAttaching = ko.observable(false);
      note.isExpanded = ko.observable(false);
      note.isDeleted = ko.observable(false);
      note.hasPreview = ko.observable(false);

      if ( ( note.body().length > 60 ) || ( note.body().split("<br />")[0].length < note.body().length ) ) {
        note.hasPreview(true);
      }

      note.preview = ko.computed(function(){
        return note.body().substring(0,60).split("<br />")[0] + "...";
      });

    }
    self.notes.unshift( new newNote() );

    self.note.body('');
    self.note.attachments([]);
    self.note.isExpanded(false);
  };

  self.removeNote = function(note) {
    note.isDeleted(true);
    self.canUndo(true);
    //self.notes.remove(note);
  };

  self.editNote = function(note) {
    note.isEditing( !note.isEditing() );

    if ( note.isEditing() == true ) {
      $('.focusInput').focus();
    }
  };

  self.expandNote = function(note) {
    ko.utils.arrayForEach(self.notes(), function(note){
      note.isExpanded(false);
    });
    note.isExpanded(true);
  }

  self.undoNoteDelete = function() {
    ko.utils.arrayForEach(self.notes(), function(note){
      note.isDeleted(false);
      self.canUndo(false);
    });
  }

  self.hideAlert = function() {
    self.canUndo(false);
  }
};

$('window').ready(function(){
  ko.applyBindings( new vm() );
});
