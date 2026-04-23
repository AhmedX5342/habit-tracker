export interface Quote {
  text: string
  author: string
}

export const disciplineQuotes: Quote[] = [
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn"
  },
  {
    text: "We do today what they won't, so tomorrow we can do what they can't.",
    author: "Unknown"
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    text: "The pain of discipline weighs ounces, but the pain of regret weighs tons.",
    author: "Jim Rohn"
  },
  {
    text: "Motivation gets you going, discipline keeps you growing.",
    author: "Unknown"
  },
  {
    text: "Discipline is the soul of an army. It makes small numbers formidable; procures success to the weak, and esteem to all.",
    author: "George Washington"
  },
  {
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "It's not what we do once in a while that shapes our lives, but what we do consistently.",
    author: "Tony Robbins"
  },
  {
    text: "Discipline is just choosing between what you want now and what you want most.",
    author: "Unknown"
  },
  {
    text: "The first and best victory is to conquer self.",
    author: "Plato"
  },
  {
    text: "You cannot escape the responsibility of tomorrow by evading it today.",
    author: "Abraham Lincoln"
  },
  {
    text: "Discipline is the foundation upon which all success is built.",
    author: "John C. Maxwell"
  },
  {
    text: "It was character that got us out of bed, commitment that moved us into action, and discipline that enabled us to follow through.",
    author: "Zig Ziglar"
  },
  {
    text: "The secret of your future is hidden in your daily routine.",
    author: "Mike Murdock"
  },
  {
    text: "Discipline is the refining fire by which talent becomes ability.",
    author: "Roy L. Smith"
  },
  {
    text: "One small step at a time is all it takes to get to where you want to be.",
    author: "Unknown"
  },
  {
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown"
  },
  {
    text: "Discipline is remembering what you want.",
    author: "David Campbell"
  },
  {
    text: "Success is nothing more than a few simple disciplines, practiced every day.",
    author: "Jim Rohn"
  },
  {
    text: "Don't give up what you want most for what you want now.",
    author: "Unknown"
  },
  {
    text: "The ability to discipline yourself to delay gratification in the short term in order to enjoy greater rewards in the long term is the indispensable prerequisite for success.",
    author: "Brian Tracy"
  },
  {
    text: "Self-discipline is an act of cultivation. It requires you to connect today's actions to tomorrow's results.",
    author: "Gary Keller"
  },
  {
    text: "You'll never change your life until you change something you do daily.",
    author: "John C. Maxwell"
  },
  {
    text: "The purpose of discipline is to increase freedom, not decrease it.",
    author: "Unknown"
  },
  {
    text: "Freedom is not the absence of commitments, but the ability to choose and commit to what matters most.",
    author: "Unknown"
  },
  {
    text: "Your habits will determine your future.",
    author: "Jack Canfield"
  },
  {
    text: "Mastering others is strength. Mastering yourself is true power.",
    author: "Lao Tzu"
  },
  {
    text: "What you do today can improve all your tomorrows.",
    author: "Ralph Marston"
  },
  {
    text: "The strongest principle of growth lies in human choice.",
    author: "George Eliot"
  },
  {
    text: "Discipline is the constant exercise of giving the best of yourself rather than doing what you feel like doing.",
    author: "Unknown"
  },
  {
    text: "You have to be disciplined to have freedom. Without discipline, you're just chaos.",
    author: "Unknown"
  },
  {
    text: "Champions don't become champions in the ring — they are merely recognized there.",
    author: "Joe Louis"
  },
  {
    text: "The only thing worse than being blind is having sight but no vision.",
    author: "Helen Keller"
  },
  {
    text: "He who conquers himself is the mightiest warrior.",
    author: "Confucius"
  },
  {
    text: "The successful person has the habit of doing the things failures don't like to do.",
    author: "E.M. Gray"
  },
  {
    text: "Without discipline, there is no life at all.",
    author: "Katherine Hepburn"
  },
  {
    text: "Discipline is just doing what needs to be done even when you don't want to.",
    author: "Unknown"
  },
  {
    text: "The only limit to your impact is your imagination and commitment.",
    author: "Tony Robbins"
  },
  {
    text: "Every master was once a disaster. Discipline turns disasters into masters.",
    author: "Unknown"
  },
  {
    text: "You can't build a reputation on what you're going to do.",
    author: "Henry Ford"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Discipline is the mother of success.",
    author: "Unknown"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "A dream without a plan is just a wish. A plan without discipline is just a fantasy.",
    author: "Unknown"
  },
  {
    text: "It is not enough to have great qualities; we must also have the management of them.",
    author: "François de La Rochefoucauld"
  },
  {
    text: "Be stronger than your excuses.",
    author: "Unknown"
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown"
  },
  {
    text: "Your future self is watching you right now through your memories. Don't let them down.",
    author: "Unknown"
  }
]

// Get a random quote
export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * disciplineQuotes.length)
  return disciplineQuotes[randomIndex]
}