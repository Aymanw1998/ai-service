# AI-SERVICE

AI-SERVICE is a global AI infrastructure layer. It is not tied to one product or chatbot.
It serves multiple projects through project-based configuration, provider routing, tool orchestration, permissions, and workflow-ready structure.

## Architecture

```txt
src/
|-- core/
|   |-- agent/          # Global orchestration flow
|   |-- projects/       # Project loading
|   |-- providerRouter/ # Provider selection and execution
|   |-- toolRegistry/   # Global tool discovery and validation
|   `-- permissions/    # Project and execution policies
|
|-- projects/
|   `-- tamheed/
|       |-- prompt.js   # Project AI behavior
|       |-- tools.js    # Tools allowed for the project
|       `-- config.js   # Provider, model, memory, permissions
|
|-- tools/
|   |-- db/
|   |-- storage/
|   |-- pdf/
|   |-- messages/
|   `-- search/
|
`-- providers/
    |-- gemini/
    |-- openai/
    `-- ollama/
```

## Request Flow

```txt
API request
-> authenticate service token
-> identify project
-> load project config, prompt, and allowed tools
-> attach runtime date, time, and timezone
-> validate project permissions
-> route to configured AI provider
-> return answer with project/provider/model metadata
```

## Chat Endpoint

```http
POST /api/ai/chat
```

```json
{
  "project": "Tamheed-Association-System",
  "message": "Create a lesson plan about fractions",
  "history": [
    {
      "role": "user",
      "content": "The class is grade 4."
    }
  ],
  "context": {
    "language": "en"
  }
}
```

The project can also be sent as `tamheed`.

Required header:

```txt
x-ai-service-token: <AI_SERVICE_TOKEN>
```

## Adding A Project

Create a new folder under `src/projects/<project-id>/` with:

- `prompt.js`
- `tools.js`
- `config.js`
- `index.js`

Then register it in `src/core/projects/loadProject.js`.

## Adding A Provider

Create a new provider under `src/providers/<provider>/index.js`, then register a loader in:

```txt
src/core/providerRouter/runProvider.js
```
