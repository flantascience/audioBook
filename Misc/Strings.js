export const posterURL = "https://firebasestorage.googleapis.com/v0/b/audiobook-cac7d.appspot.com/o/images%2Fpart2-unschooling.jpg?alt=media&token=955a541e-cbcb-4388-a3cb-f4fc80a4939c";
export const header = {
  headerText: "Curricu-Dumb",
  subHeaderText: "what teachers can't tell you"
}
export const footer = {
  home: { text:"Home", place: "First" },
  tracks: { text:"Tracks", place: "Second" },
  author: { text:"Author", place: "Third" }
}

export const tracks = {
  noInternetConnection: "You cannot stream without an active internet connection.",
  redownloadTrack: "You need to re-download this track.",
  restartApp: "Something went wrong, please restart app and try again."
}

export const author = {
  name: "Jim Flannery",
  title: "Author of Curricu-Dumb",
  intro: "I am a former high school teacher who became fed up with how poorly the system treats young people." +
  " Join me on my mission to liberate young people from schools to thrive in freedom.",
  callToAction: "Want updates about future projects?",
  buttonText: "JOIN MAILING LIST",
  emailPlaceHolder: "email@provider.com"
}

export const audioOverview = {
  titleText: "Track Feedback",
  confusing1: "Was anything confusing?",
  otherQuestion1: "Do you have any questions?",
  confusingFinal: "Now that you've finished, is anything still unclear?",
  otherQuestionFinal: "Are there any questions that are still unanswered?",
  anythingElse: "Anything else you want to tell me about this track?"
}

export const refsStrings = {
  noRefs: "There are no references or links for this track",
  transparencyStatementTitle: "Transparency statement: ",
  transparencyStatementText: "I receive a 5% commission on anything purchased through links to Amazon"
}

export const initFilesState = [
    {
      name: "Introduction",
      url: "./tracks/sample_claps.mp3",
      duration: "00.28",
      type: "local"
    }, 
    {
      name: "Why I made this app",
      url: "./tracks/sample_noise.mp3",
      duration: "00:45",
      type: "local"
    }
  ];