export type AuthType = 'SSH' | 'PAT';

export interface Account {
    Alias: string;
    Name: string;
    Email: string;
    AuthType?: AuthType;
    SshKeyPath?: string;
    GitUsername?: string;
    Token?: string;
}

export interface Settings {
    Confirmation: boolean;
}

export interface Config {
    Accounts: Account[];
    ActiveProfile: string | null;
    Settings: Settings;
}

export const defaultConfig: Config = {
    Accounts: [],
    ActiveProfile: null,
    Settings: {
        Confirmation: false
    }
};
