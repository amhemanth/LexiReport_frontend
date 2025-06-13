export interface VoiceCommand {
  id: string;
  text: string;
  category: string;
}

export interface CommandResponse {
  id: string;
  text: string;
  action?: string;
}

export const mockCommands: VoiceCommand[] = [
  {
    id: 'create-report',
    text: 'Create a new financial report',
    category: 'report'
  }
];

export const mockResponses: CommandResponse[] = [
  {
    id: 'create-report',
    text: 'Creating a new financial report...',
    action: 'navigate_to_create_report'
  }
];

export function findMatchingCommand(text: string): VoiceCommand | undefined {
  return mockCommands.find(cmd => 
    cmd.text.toLowerCase().includes(text.toLowerCase())
  );
}

export function getResponseByCommandId(id: string): CommandResponse | undefined {
  return mockResponses.find(resp => resp.id === id);
}

export function getCommandsByType(category: string): VoiceCommand[] {
  return mockCommands.filter(cmd => cmd.category === category);
} 