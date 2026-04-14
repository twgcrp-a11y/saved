/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseResume(textOrFile: string | { data: string, mimeType: string }) {
  let contents: any;
  
  if (typeof textOrFile === 'string') {
    contents = `Extract candidate information from the following resume text. 
    Normalize experience to a number (years). 
    Standardize skills and locations.
    
    Resume Text:
    ${textOrFile}`;
  } else {
    contents = [
      `Extract candidate information from the attached resume document. 
      Normalize experience to a number (years). 
      Standardize skills and locations.`,
      {
        inlineData: {
          data: textOrFile.data,
          mimeType: textOrFile.mimeType
        }
      }
    ];
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          phone: { type: Type.STRING },
          email: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experience: { type: Type.NUMBER },
          location: { type: Type.STRING },
        },
        required: ["name", "email", "skills", "experience", "location"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function calculateMatchScore(candidate: any, job: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare the candidate profile with the job description and calculate a match score (0-100).
    Provide a brief reasoning.
    
    Candidate:
    ${JSON.stringify(candidate)}
    
    Job:
    ${JSON.stringify(job)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
        required: ["score", "reasoning"],
      },
    },
  });

  return JSON.parse(response.text || '{"score": 0, "reasoning": "Error calculating score"}');
}
