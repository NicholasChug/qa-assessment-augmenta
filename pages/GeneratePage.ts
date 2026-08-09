import { Locator, Page, expect } from '@playwright/test';
import { SocialPlatform } from '../helpers/Social';
import { Skill } from '../helpers/Skills';

type ProfileDetails = {
    title: string;
    subtitle: string;
    currentWork: { name: string; url: string };
    collaboration: { name: string; url: string };
};

export class GeneratePage {
    readonly page: Page;
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

    async goTo(url = '.') {
        await this.page.goto(url);
    }

    async fillProfile(details: ProfileDetails) {
        await this.titleInputField.fill(details.title);
        await this.subtitleInputField.fill(details.subtitle);
        await this.currentWorkProjectInputField.fill(details.currentWork.name);
        await this.currentWorkProjectLinkInputField.fill(details.currentWork.url);
        await this.collaborationInputField.fill(details.collaboration.name);
        await this.collaborationLinkInputField.fill(details.collaboration.url);
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

    async configureTopLanguages(titleColor: string) {
        await this.topSkillsCheckbox.check({ force: true });
        await this.topSkillsEditButton.click();
        await this.topSkillsTitleColourButton.fill(titleColor);
    }

    async generateReadme() {
        await this.generateREADMEButton.click();
    }

    async retrieveGithubAPIStarCount(url: string): Promise<number> {
        const response = await this.page.request.get(url);
        expect(response.ok()).toBe(true);
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

    async uploadJSONFile(filePath: string) {
        const fileInput = this.uploadJSONInput;
        await fileInput.setInputFiles(filePath);
    }

    async restorePage() {
        await this.restorePageButton.click();
    }

}
