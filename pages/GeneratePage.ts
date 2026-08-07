import { Locator, Page } from '@playwright/test';
import { SocialPlatform } from '../helpers/Social';
import { Skill } from '../helpers/Skills';

export class GeneratePage {
    readonly page: Page;
    readonly generateButton: Locator;
    readonly generatedText: Locator;
    readonly titleInputField: Locator;
    readonly subtitleInputField: Locator;
    readonly currentWorkProjectInputField: Locator;
    readonly currentWorkProjectLinkInputField: Locator;
    readonly collaborationInputField: Locator;
    readonly collaborationLinkInputField: Locator;
    readonly topSkillsCheckbox: Locator;
    readonly generateREADMEButton: Locator;
    readonly markdownBox: Locator;


    constructor(page: Page) {
        this.page = page;
        this.generateButton = page.locator('button#generate');
        this.generatedText = page.locator('div#generated-text');
        this.titleInputField = page.locator('#title-name');
        this.subtitleInputField = page.locator('#subtitle');
        this.currentWorkProjectInputField = page.locator('#currentWork');
        this.currentWorkProjectLinkInputField = page.locator('#currentWork-link');
        this.collaborationInputField = page.locator('#collaborateOn');
        this.collaborationLinkInputField = page.locator('#collaborateOn-link');
        this.topSkillsCheckbox = page.locator('#top-languages');
        this.generateREADMEButton = page.getByRole('button', { name: 'Generate README' });
        this.markdownBox = page.locator('#markdown-box');
    }

    async goTo(url: string) {
        await this.page.goto(url);
    }

    async selectSkill(skill: Skill) {
        await this.page.locator(`#${skill}`).check();
    }

    async selectSkills(skills: Skill[]) {
        for (const skill of skills) {
            await this.selectSkill(skill);
        }
    }

    async fillSocial(platform: SocialPlatform, value: string) {
        await this.page.locator(`#${platform}`).fill(value);
    }

    async clickGenerateButton() {
        await this.generateButton.click();
    }

    async getGeneratedText(): Promise<string | null> {
        return await this.generatedText.textContent();
    }

}