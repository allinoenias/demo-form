import { getAccessToken } from './firebaseAuth';
import { StudentLead } from '../types/form';

export interface CreatedGoogleForm {
  formId: string;
  title: string;
  description: string;
  responderUri: string;
  editUri: string;
  revisionId?: string;
}

export const createAcademyGoogleForm = async (): Promise<CreatedGoogleForm> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in with your Google Account first.');
  }

  // 1. Create Initial Form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: '🎯 Government Exam Preparation – Free Demo Class Registration',
        documentTitle: 'All In One Academy Jorhat - Demo Class Registration',
      },
    }),
  });

  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(`Failed to create Google Form: ${createRes.status} ${errBody}`);
  }

  const newForm = await createRes.json();
  const formId = newForm.formId;

  // 2. Batch update form to set description & all 9 questions
  const batchRequests = [
    {
      updateFormInfo: {
        info: {
          description: `Preparing for ADRE, SSC, Banking, Railway or other government exams? Register for our Free Demo Class and learn the right strategy, practice methods and preparation approach.\n\n📍 All In One Academy\nJB Road, Near IndusInd Bank, Malowali, Jorhat\n📞 9365562718 / 9954410525\n🎁 Register now for your FREE Demo Class! Limited seats available.`,
        },
        updateMask: 'description',
      },
    },
    // Q1: Full Name
    {
      createItem: {
        item: {
          title: 'Full Name',
          description: 'Enter your legal/official full name for demo class entry pass',
          questionItem: {
            question: {
              required: true,
              textQuestion: {
                paragraph: false,
              },
            },
          },
        },
        location: { index: 0 },
      },
    },
    // Q2: WhatsApp/Mobile Number
    {
      createItem: {
        item: {
          title: 'WhatsApp / Mobile Number',
          description: 'Active 10-digit number for demo class confirmation & study material',
          questionItem: {
            question: {
              required: true,
              textQuestion: {
                paragraph: false,
              },
            },
          },
        },
        location: { index: 1 },
      },
    },
    // Q3: Which government exam are you preparing for?
    {
      createItem: {
        item: {
          title: 'Which government exam are you preparing for?',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'ADRE' },
                  { value: 'SSC' },
                  { value: 'Banking' },
                  { value: 'Railway' },
                  { value: 'Assam Government Exams' },
                  { isOther: true },
                ],
                shuffle: false,
              },
            },
          },
        },
        location: { index: 2 },
      },
    },
    // Q4: Current preparation level
    {
      createItem: {
        item: {
          title: 'What is your current preparation level?',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'Just Starting' },
                  { value: 'Beginner' },
                  { value: 'Preparing for a few months' },
                  { value: 'Already appearing for exams' },
                ],
              },
            },
          },
        },
        location: { index: 3 },
      },
    },
    // Q5: Which subjects are difficult for you?
    {
      createItem: {
        item: {
          title: 'Which subjects are difficult for you?',
          description: 'Select all that apply to get customized mentor support',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'CHECKBOX',
                options: [
                  { value: 'Maths' },
                  { value: 'Reasoning' },
                  { value: 'English' },
                  { value: 'GK' },
                  { value: 'Current Affairs' },
                  { value: 'Assam GK' },
                  { value: 'CSAT' },
                ],
              },
            },
          },
        },
        location: { index: 4 },
      },
    },
    // Q6: Biggest preparation challenge
    {
      createItem: {
        item: {
          title: 'What is your biggest preparation challenge?',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'CHECKBOX',
                options: [
                  { value: "Don't know where to start" },
                  { value: 'Lack of proper guidance' },
                  { value: 'Difficulty maintaining consistency' },
                  { value: 'Weak in some subjects' },
                  { value: 'Need regular tests/practice' },
                  { value: 'Time management' },
                ],
              },
            },
          },
        },
        location: { index: 5 },
      },
    },
    // Q7: Preferred class timing
    {
      createItem: {
        item: {
          title: 'Preferred class timing:',
          description: 'Choose morning, afternoon, evening, or specify your custom preferred timing',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'Morning (8:00 AM – 11:00 AM)' },
                  { value: 'Afternoon (12:00 PM – 3:00 PM)' },
                  { value: 'Evening (4:00 PM – 7:00 PM)' },
                  { isOther: true },
                ],
              },
            },
          },
        },
        location: { index: 6 },
      },
    },
    // Q8: Attend FREE Demo Class
    {
      createItem: {
        item: {
          title: 'Would you like to attend a FREE Demo Class?',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'Yes, I want to attend' },
                  { value: 'I want more information' },
                ],
              },
            },
          },
        },
        location: { index: 7 },
      },
    },
    // Q9: How did you hear about All In One Academy?
    {
      createItem: {
        item: {
          title: 'How did you hear about All In One Academy?',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'Facebook' },
                  { value: 'Instagram' },
                  { value: 'YouTube' },
                  { value: 'WhatsApp' },
                  { value: 'Friend/Student' },
                  { isOther: true },
                ],
              },
            },
          },
        },
        location: { index: 8 },
      },
    },
  ];

  const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: batchRequests,
    }),
  });

  if (!updateRes.ok) {
    const errBody = await updateRes.text();
    console.error('Batch update failed:', errBody);
  }

  // Fetch updated form to get finalized responder URL
  const getRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const finalForm = getRes.ok ? await getRes.json() : newForm;

  return {
    formId,
    title: finalForm.info?.title || '🎯 Government Exam Preparation – Free Demo Class Registration',
    description: finalForm.info?.description || '',
    responderUri: finalForm.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`,
    editUri: `https://docs.google.com/forms/d/${formId}/edit`,
    revisionId: finalForm.revisionId,
  };
};

export const fetchGoogleFormDetails = async (formId: string) => {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch form details: ${res.statusText}`);
  }

  return await res.json();
};

export const fetchGoogleFormResponses = async (formId: string) => {
  const token = await getAccessToken();
  if (!token) return [];

  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch form responses: ${res.statusText}`);
  }

  const data = await res.json();
  return data.responses || [];
};
