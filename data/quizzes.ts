import { Quiz } from '../types';

export const quizzes: Quiz[] = [
  {
    id: 'genesis-beginnings',
    title: 'Genesis: The Beginning',
    description: 'Test your knowledge on the foundational stories of the book of Genesis.',
    image: 'https://images.pexels.com/photos/372327/pexels-photo-372327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    questions: [
      {
        question: 'On what day did God create mankind?',
        options: ['Third day', 'Fifth day', 'Sixth day', 'Seventh day'],
        correctAnswer: 'Sixth day',
        reference: 'Genesis 1:26-27',
        explanation: 'God created man in His own image on the sixth day, after creating the land animals.'
      },
      {
        question: 'What was the name of Abraham\'s wife?',
        options: ['Rebekah', 'Sarah', 'Leah', 'Rachel'],
        correctAnswer: 'Sarah',
        reference: 'Genesis 17:15',
        explanation: 'God changed her name from Sarai to Sarah, meaning "princess," and promised she would be the mother of nations.'
      },
      {
        question: 'How many sons did Jacob have?',
        options: ['2', '10', '12', '13'],
        correctAnswer: '12',
        reference: 'Genesis 35:22-26',
        explanation: 'Jacob had twelve sons, who became the progenitors of the twelve tribes of Israel.'
      },
      {
        question: 'Who was sold into slavery in Egypt by his brothers?',
        options: ['Isaac', 'Esau', 'Joseph', 'Benjamin'],
        correctAnswer: 'Joseph',
        reference: 'Genesis 37:28',
        explanation: 'Out of jealousy, Joseph\'s brothers sold him to Midianite traders, who then took him to Egypt.'
      },
      {
        question: 'What did God use to create Eve?',
        options: ['A handful of dust', 'A flower', 'Adam\'s rib', 'A beam of light'],
        correctAnswer: 'Adam\'s rib',
        reference: 'Genesis 2:21-22',
        explanation: 'God caused a deep sleep to fall upon Adam, and He took one of his ribs and made it into a woman.'
      }
    ],
  },
];
