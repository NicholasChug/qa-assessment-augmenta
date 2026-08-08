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
    readonly funFactTitleField: Locator;
    readonly topSkillsCheckbox: Locator;
    readonly topSkillsEditButton: Locator;
    readonly topSkillsTitleColourButton: Locator;
    readonly generateREADMEButton: Locator;
    readonly markdownBox: Locator;
    readonly hostedStarCount: Locator;
    readonly webpageStarCount: Locator;
    readonly uploadJSONInput: Locator;
    readonly restorePageButton: Locator;


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
        this.funFactTitleField = page.locator('#funFact-prefix');
        this.topSkillsCheckbox = page.locator('#top-languages');
        this.topSkillsEditButton = page.locator('#top-languages-open-btn');
        this.topSkillsTitleColourButton = page.locator('#top-lang-title-color');
        this.generateREADMEButton = page.getByRole('button', { name: 'Generate README' });
        this.markdownBox = page.locator('#markdown-box');
        this.hostedStarCount = page.locator('span.github-count');
        this.webpageStarCount = this.page.locator('#repo-stars-counter-star');
        // Adding additional specificty here to ensure resiliency for upload button
        this.uploadJSONInput = page.getByRole('button', { name: 'Upload json file' }).locator('xpath=preceding-sibling::input[@type="file"]');
        this.restorePageButton = page.getByRole('button', { name: 'Restore' });
    }

    async goTo(url: string) {
        await this.page.goto(url);
    }

    async selectSkill(skill: Skill) {
        await this.page.locator(`#${skill}`).check({ force: true });
    }

    async selectSkills(skills: Skill[]) {
        for (const skill of skills) {
            await this.selectSkill(skill);
        }
    }

    async fillSocials(platforms: Array<{ platform: SocialPlatform; value: string }>) {
        for (const { platform, value } of platforms) {
            await this.page.locator(`#${platform}`).fill(value);
        }
    }

    async changeColour(colour: string, targetField: Locator) {
        await targetField.fill(colour);
    }

    async retrieveGithubAPIStarCount(url: string): Promise<number> {
        const response = await this.page.request.get(url);
        const data = await response.json();
        const starCount = data.stargazers_count;
        return starCount;
    }

    async retrieveGithubWebpageStarCount(url: string): Promise<number> {
        await this.goTo(url);
        await this.page.waitForLoadState('domcontentloaded');

        const exactCount = await this.webpageStarCount.getAttribute('title');
        return parseInt((exactCount || '0').replace(/,/g, ''), 10);
    }

    async compareStarCount(hostedCount: number, githubCount: number): Promise<boolean> {
        return hostedCount === githubCount;
    }

    async uploadJSONFile(filePath: string) {
        const fileInput = this.uploadJSONInput;
        await fileInput.setInputFiles(filePath);
    }

    async restorePage() {
        await this.restorePageButton.click();
    }

}
