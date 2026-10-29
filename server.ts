import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Meta Model API (OpenAI-compatible Chat Completions).
const META_API_BASE_URL = (process.env.META_API_BASE_URL || 'https://api.meta.ai/v1').replace(/\/$/, '');
const META_MODEL = process.env.META_MODEL || 'muse-spark-1.2';

app.use(express.json());

async function metaChatJson(
  apiKey: string,
  messages: Array<{ role: string; content: string }>
): Promise<unknown> {
  const metaRes = await fetch(`${META_API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: META_MODEL,
      messages,
      response_format: { type: 'json_object' }
    })
  });

  if (!metaRes.ok) {
    const errText = await metaRes.text();
    throw new Error(`Meta API error ${metaRes.status}: ${errText.slice(0, 500)}`);
  }

  const data = (await metaRes.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = data.choices?.[0]?.message?.content || '{}';
  return JSON.parse(stripCodeFences(content));
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
  }
  return trimmed;
}

// API endpoint to generate new Cyber Crew books with 4 episodes each
app.post('/api/generate-books', async (req, res) => {
  const { startBookNumber = 6, count = 5 } = req.body;

  try {
    const apiKey = process.env.META_API_KEY || process.env.MODEL_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        message: 'No META_API_KEY configured on server; client generator will provide high-quality curated procedural books.',
        useClientFallback: true
      });
    }

    const prompt = `You are the lead storyteller and Linux educator for "The Cyber Crew".
The Cyber Crew consists of 4 friends:
- Kazz (bright patchwork parka/jacket, tech explorer, recon, loves verifying files with ls and inspecting paths)
- Windel (square glasses, yellow boots/sneakers, systems theorist who explains Linux syntax)
- Kali (terminal operator who executes commands on the floating terminal)
- Debbie (spiral notebook in hand, system reliability, data backup architect)

Their canonical cheer is ALWAYS: "Root permissions, ready to go! Three, two, one... SUDO!"
Catchphrase closing: Debbie snaps her notebook shut with "Backup created, original preserved, directory safe."

CRITICAL REQUIREMENTS FROM USER:
1. VARIETY OF LINUX COMMANDS: Do NOT give every episode "[cp]"! Each book must practice different real Linux commands matching the crisis (e.g. "cp", "cat", "ls", "mkdir", "mv", "grep", "touch", "chmod", "diff", "find", "tar", "echo", "pwd", "head", "tail", "df"). Every episode's "badge" field MUST be the specific command practiced in that episode (e.g., "cat", "grep", "touch", "chmod", "mkdir", "mv", "ls", "diff", "tar", "echo").
2. HIGHLY CREATIVE, LOOSENED NAMING (NO BORING / REPETITIVE FORMULAS):
   - Every book title, book description, episode title, and episode subtitle MUST BE 100% UNIQUE.
   - FORBIDDEN: NEVER use rigid repetitive templates like "The [Place] [CMD] Protocol" or "Mission X: Mastering [cmd] Operations" or "The [Book Title] - Chapter X".
   - INSTEAD: Loosen parameters! Write colorful, imaginative Saturday-morning cartoon / sci-fi adventure titles (e.g., "The Whispering Asteroid", "The Stasis Inverter Meltdown", "Secrets of the Copper Nebula", "The Phantom Beacon of Sector 4", "Rendezvous at the Magnetic Maw", "The Abyssal Blueprint Reveal").
   - Subtitles must be vivid mission descriptions (e.g., "Rerouting emergency thermal conduits through the basalt trench", "Bouncing high-altitude radar pings before the solar eclipse", "Extracting encrypted telemetry from the sunken rover").
3. PROGRESSIVE STORY ARC: The 4 episodes in each book must form a connected 4-episode serialized storyline progressing through that region:
   - Episode 1: Initial Discovery / Sensor Sweep / Reconnaissance
   - Episode 2: Telemetry Analysis / Reading / Duplication of Critical Data
   - Episode 3: System Containment / Directory Vaulting / Filtering Anomaly Signals
   - Episode 4: Securing Payload / Access Permissions / Final Grid Lockdown

We need exactly ${count} NEW BOOKS, where each book has exactly 4 EPISODES (total ${count * 4} episodes).
The book numbering starts at Book ${startBookNumber}.

Return a valid JSON array of ${count} books with the following structure:
[
  {
    "id": "book-${startBookNumber}",
    "number": ${startBookNumber},
    "title": "Book ${startBookNumber}: Unique Creative Title",
    "subtitle": "Unique Creative Book Subtitle",
    "themeName": "Sci-Fi Setting Name (e.g. Neon Canopy & Arboreal Grid, Chrono Clocktower & Harmonic Gears, etc.)",
    "description": "Unique multi-sentence description of the sci-fi region and the technical crisis facing the Cyber Crew.",
    "coverGradient": "from-purple-900 via-indigo-950 to-slate-950",
    "accentColor": "#a855f7",
    "badgeIcon": "<emoji matching the theme>",
    "episodes": [
      {
        "id": "ep-${startBookNumber}-1",
        "number": 1,
        "title": "Unique Creative Episode Title 1",
        "subtitle": "Unique Descriptive Mission Subtitle",
        "environmentName": "Specific Location Name",
        "badge": "command (e.g. touch or cat or grep or chmod or mkdir)",
        "command": "command (matching badge)",
        "theme": {
          "primary": "#a855f7",
          "secondary": "#3b82f6",
          "accent": "#eab308",
          "bgGradient": "from-slate-950 via-purple-950 to-slate-900"
        },
        "blueprintFile": "unique_filename.cad",
        "backupFile": "unique_filename_backup.cad",
        "vaultName": "unique_vault",
        "vehicleType": "rover" | "submarine" | "drone" | "crawler" | "glider",
        "containerShape": "capsule" | "cylinder" | "crystal",
        "environment": "lake" | "station" | "canopy" | "reef" | "orbit" | "cavern" | "arctic" | "sandstorm" | "dam" | "volcano",
        "narrativePages": [
          "Page 1 narrative with cheer",
          "Page 2 narrative with delivery",
          "Page 3 narrative with command execution",
          "Page 4 narrative with verification",
          "Page 5 narrative with vault lock",
          "Page 6 narrative with safe closing"
        ]
      }
    ]
  }
]`;

    const parsed: unknown = await metaChatJson(apiKey, [{ role: 'user', content: prompt }]);
    const books = Array.isArray(parsed)
      ? parsed
      : (parsed as { books?: unknown }).books;
    if (!Array.isArray(books)) {
      throw new Error('Meta API returned JSON without a book array');
    }
    return res.json({
      success: true,
      books
    });
  } catch (error) {
    console.error('Meta generation error, providing fallback:', error);
    return res.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown AI error',
      useClientFallback: true
    });
  }
});

// API endpoint for Kazz's AI Isolated Container Coach
app.post('/api/kazz-isolate', async (req, res) => {
  const {
    command = 'ls',
    commandSyntax = '',
    adventureTitle = 'Glacier Kernel Adventure',
    pageNumber = 1,
    contextStory = '',
    userPrompt = ''
  } = req.body;

  try {
    const apiKey = process.env.META_API_KEY || process.env.MODEL_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        message: 'No META_API_KEY configured; client fallback will supply instant tactical briefing.',
        useClientFallback: true
      });
    }

    const systemInstruction = `You are Kazz from "The Cyber Crew".
Persona:
- Role: Sandbox Architect & Recon Specialist operating inside a secure Kasm Web container workspace ("ISOLATE").
- Personality: High-energy, warm, encouraging, brotherly, loves testing commands in disposable pods without fear of crashing the system.
- Calling the player: "Explorer", "Crewmate", or "Terminal Pilot".
- Style: Punchy, clear, visual analogies, zero stuffiness, memorable mnemonics.
- Mission: Help the player understand and permanently remember the Linux command: "${command}".
- Current mission context: ${adventureTitle} (Page ${pageNumber}).
${contextStory ? `Story excerpt: ${contextStory}` : ''}
${userPrompt ? `The player specifically asks Kazz: "${userPrompt}"` : ''}

CRITICAL: Return a single strictly valid JSON object with these exact keys:
{
  "greeting": "Punchy 1-sentence greeting from Kazz in his Kasm sandbox",
  "mnemonic": "An unforgettable, catchy memory hook / mnemonic to instantly remember what this command does",
  "explanation": "2-3 sentences explaining the command clearly and practically",
  "sandboxTip": "1 practical tip on when or how to run it safely",
  "flagsToKnow": [
    {"flag": "-example", "meaning": "what it does"}
  ],
  "funFact": "1 fascinating bite-sized Linux container or terminal fact",
  "practiceChallenge": "1 short practice exercise the user can test in the sandbox terminal"
}`;

    const parsed: unknown = await metaChatJson(apiKey, [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: `Isolate and explain command: ${command} ${commandSyntax ? `(Example syntax: ${commandSyntax})` : ''}` }
    ]);
    return res.json({
      success: true,
      coachData: parsed
    });
  } catch (error) {
    console.error('Kazz isolate AI error, utilizing fallback:', error);
    return res.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown AI error',
      useClientFallback: true
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cyber Crew server ready: open http://localhost:${PORT} in your browser (listening on 0.0.0.0:${PORT})`);
  });
}

startServer();
