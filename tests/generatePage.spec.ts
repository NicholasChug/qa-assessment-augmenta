import { test, expect } from '@playwright/test';
import { GeneratePage } from '../pages/GeneratePage';
import { Skill } from '../helpers/Skills';
import { SocialPlatform } from '../helpers/Social';

let generatePage: GeneratePage;

test.beforeEach(async ({ page }) => {
    generatePage = new GeneratePage(page);
    await generatePage.goTo();
    await expect(page).toHaveTitle('GitHub Profile Readme Generator | GitHub Profile Readme Generator');
});

test('Navigate to webpage and fill select input fields', async ({ page }) => {
    const cyan = '#34ebdb';

    await generatePage.fillProfile({
        title: 'John Doe',
        subtitle: 'Your Friendly Neighbourhood Developer',
        currentWork: { name: 'Open Source Project', url: 'https://github.com/open-source-project' },
        collaboration: { name: 'Collaboration Project', url: 'https://github.com/collaboration-project' },
    });

    // Select skills from predefined Skill list
    const selectedSkills = [Skill.Javascript, Skill.Python, Skill.VueJS, Skill.Angular, Skill.AWS, Skill.Azure];
    await generatePage.selectSkills(selectedSkills);

    for (const skill of selectedSkills) {
        await expect(page.locator(`#${skill}`)).toBeChecked();
    }

    // Fill social media input fields
    await generatePage.fillSocials([{
        platform: SocialPlatform.Twitter,
        value: '@johndoe'
    }, {
        platform: SocialPlatform.GitHub,
        value: 'nicholaschug'
    }]);
    await expect(page.locator(`#${SocialPlatform.Twitter}`)).toHaveValue('@johndoe');
    await expect(page.locator(`#${SocialPlatform.GitHub}`)).toHaveValue('nicholaschug');

    await generatePage.configureTopLanguages(cyan);
    await expect(generatePage.topSkillsCheckbox).toBeChecked();
    await expect(generatePage.topSkillsTitleColourButton).toHaveValue('#34ebdb');

    await generatePage.generateReadme();

    await expect(generatePage.markdownBox).toBeVisible();
    await expect(generatePage.markdownBox).toContainText('Your Friendly Neighbourhood Developer');
    const generatedHTML = await generatePage.markdownBox.innerHTML();
    expect(generatedHTML).toMatch(/javascript/i);

});

test('Capture and compare GitHub Star count on hosted webpage with GitHub API', async () => {
    // Capture the GitHub Star count from the hosted webpage
    const hostedStarCountText = await generatePage.hostedStarCount.nth(0).textContent();
    const hostedStarCount = parseInt(hostedStarCountText?.replace(',', '') || '0', 10);

    // 1st comparison method: Fetch the GitHub Star count from the GitHub API
    const githubStarCountAPI = await generatePage.retrieveGithubAPIStarCount('https://api.github.com/repos/rahuldkjain/github-profile-readme-generator');
    // Compare the two star counts
    expect(Math.abs(hostedStarCount - githubStarCountAPI)).toBeLessThanOrEqual(1); // Allowing a difference of 1 due to potential timing issues

    // 2nd comparison method: Fetch the GitHub Star count from the GitHub repository page
    const githubStarCountWebpage = await generatePage.retrieveGithubWebpageStarCount('https://github.com/rahuldkjain/github-profile-readme-generator');
    // Compare the two star counts
    expect(Math.abs(hostedStarCount - githubStarCountWebpage)).toBeLessThanOrEqual(1); // Allowing a difference of 1 due to potential timing issues

});

test('Upload supplied JSON file and verify that restored fields match expectations', async () => {
    // Upload the supplied JSON file
    const jsonFilePath = 'data/data.json';
    await generatePage.uploadJSONFile(jsonFilePath);

    // Restore the page to ensure that the uploaded JSON data is reflected in the input fields
    await generatePage.restorePage();

    // Check for modified fields post page restoration
    await expect(generatePage.currentWorkProjectInputField).toHaveValue('project name');
    await expect(generatePage.funFactTitleField).toHaveValue(/Modified Facts/i);

});
