import * as Discord from "discord.js";
import * as assert from "assert";
import Sinon, * as sinon from "sinon";
import * as roles from "../../roles";
import * as util from "../../util";

import process from "../groups"


//Does all this stuff really *need* all this testing? 
//Not *really*, but MrSticky wanted to play with TDD
describe('Groups', function() {
    const fakeGroupName = "oogaboogabooga"
    const fakeRole = { name: `g-${fakeGroupName}`}

    //We make heavy use of sinon stubs here and ignore all the business logic in roles
    //Would be cooler if we could easily just stub out the Discord API calls...But :effort:
    //https://github.com/discordjs/discord.js/issues/3576

    let fakeMessage = {} as Discord.Message;
    let stubs: definedStubs
    beforeEach(() => {
        stubs = getStubs();

        fakeMessage = {
            channel: {
                send: stubs.sendToChannel
            },
            member: {
                id: 12345
            },
            author: {
                send: stubs.sendToAuthor
            },
            content: ''
        } as unknown as Discord.Message

    });

    this.afterEach(() => {
        sinon.restore();
    })

  describe('create', function() {

    let existingGroups: Discord.Role[];
    this.beforeEach(() => {
        existingGroups = []; 
        existingGroups.push(buildFakeRole('g-groupOne'));
        existingGroups.push(buildFakeRole('g-groupTwo'));
        
    })

    it('Creates a new group replacing spaces with dashes', async function() {
        fakeMessage.content = `!groups create ooga booga booga`
        stubs.getAllRoles.returns(existingGroups)
        stubs.createRole.returns(buildFakeRole(`g-${fakeGroupName}`));

        await process(fakeMessage)

        sinon.assert.notCalled(stubs.notifyAuthorOfFailure)
        sinon.assert.calledOnce(stubs.createRole);
        assert.strictEqual(stubs.createRole.getCall(0).args[1],`g-ooga-booga-booga`);
        sinon.assert.calledOnce(stubs.sendToChannel)
    });

    it('Adds you to the new group you created', async function() {
        fakeMessage.content = `!groups create ${fakeGroupName}`;
        stubs.getAllRoles.returns(existingGroups)
        stubs.createRole.returns(buildFakeRole(`g-${fakeGroupName}`));

        await process(fakeMessage);

        const addedRole: Discord.Role = stubs.addRoleToMembers.firstCall.args[0];
        const addedMembers: Discord.GuildMember[] = stubs.addRoleToMembers.firstCall.args[1];

        assert.strictEqual(addedRole.name, `g-${fakeGroupName}`)
        assert.strictEqual(addedMembers[0].id, 12345)

    })

    it('Errors if group already exists', async function() {
        fakeMessage.content = `!groups create ${fakeGroupName}`;
        existingGroups.push(buildFakeRole(`g-${fakeGroupName}`));
        stubs.getAllRoles.returns(existingGroups)

        await process(fakeMessage);

        sinon.assert.calledOnce(stubs.notifyAuthorOfFailure);
        sinon.assert.notCalled(stubs.sendToChannel)
        sinon.assert.notCalled(stubs.createRole)
    });

    it('Cleanly handles invalid syntax', async function() {
        fakeMessage.content = `!groups create`;

        await process(fakeMessage);

        sinon.assert.calledOnce(stubs.sendToAuthor); //Redirected to help
        sinon.assert.notCalled(stubs.findRole); //Didn't even try to look up the role

    })
  });
  describe('join', function() {
    it('Joins an existing group', async function() {
        fakeMessage.content = `!groups join ${fakeGroupName}`
        stubs.findRole.returns(fakeRole)

        await process(fakeMessage);

        const addedRole: Discord.Role = stubs.addRoleToMembers.firstCall.args[0];
        const addedMembers: Discord.GuildMember[] = stubs.addRoleToMembers.firstCall.args[1];

        assert.strictEqual(addedRole.name, `g-${fakeGroupName}`)
        assert.strictEqual(addedMembers[0].id, 12345)

        sinon.assert.calledOnce(stubs.sendToAuthor)
    });

    it('Errors if the group does not exist', async function () {
        fakeMessage.content = `!groups join ${fakeGroupName}`;
        stubs.findRole.returns(null);

        await process(fakeMessage);

        sinon.assert.calledOnce(stubs.notifyAuthorOfFailure);
        sinon.assert.notCalled(stubs.addRoleToMembers);
        sinon.assert.notCalled(stubs.sendToAuthor);
    });
    
    it('Errors if adding to the group fails', async function () {
        fakeMessage.content = `!groups join ${fakeGroupName}`;
        stubs.findRole.returns(fakeRole);
        stubs.addRoleToMembers.callsFake((_,members:Discord.GuildMember[], failures: Discord.GuildMember[]) => {
            failures.push(members[0]);
        });

        await process(fakeMessage);

        sinon.assert.calledOnce(stubs.notifyAuthorOfFailure);
        sinon.assert.notCalled(stubs.sendToAuthor);
    });
  });

  describe('leave', function() { 
    it('Removes you from the group', async function() {
        fakeMessage.content = `!groups leave ${fakeGroupName}`;
        stubs.findRole.returns(fakeRole);
        
        await process(fakeMessage);

        const roleRemoved: Discord.Role = stubs.removeRoleFromMembers.firstCall.args[0];
        const removedMembers: Discord.GuildMember[] = stubs.removeRoleFromMembers.firstCall.args[1];

        assert.strictEqual(roleRemoved.name, `g-${fakeGroupName}`)
        assert.strictEqual(removedMembers[0].id, 12345)

        sinon.assert.calledOnce(stubs.sendToAuthor)
    });

    it('Errors if the group does not exist', async function () {
        fakeMessage.content = `!groups leave ${fakeGroupName}`;

        await process(fakeMessage);

        sinon.assert.calledOnce(stubs.notifyAuthorOfFailure);
        sinon.assert.notCalled(stubs.addRoleToMembers);
        sinon.assert.notCalled(stubs.sendToAuthor);
    });
    

  });
  describe('delete', function() {
    it('Deletes a group', async function() {
        fakeMessage.content = `!groups delete ${fakeGroupName}`;
        stubs.tryDeleteRole.returns(true);

        await process(fakeMessage);
        
        sinon.assert.calledOnce(stubs.tryDeleteRole);
        sinon.assert.calledOnce(stubs.sendToChannel);
        sinon.assert.notCalled(stubs.notifyAuthorOfFailure);
    });    
    it(`Errors if the group doesn't exist`, async function () {
        fakeMessage.content = `!groups delete ${fakeGroupName}`;
        stubs.tryDeleteRole.returns(false);

        await process(fakeMessage);

        sinon.assert.calledOnce(stubs.tryDeleteRole);
        sinon.assert.notCalled(stubs.sendToChannel);
        sinon.assert.calledOnce(stubs.notifyAuthorOfFailure);    
    });
  });
  describe('list', function() {
    it('Returns only group roles', async function() {
        fakeMessage.content = `!groups list`;
        const fakeRoles: Discord.Role[] = [];
        fakeRoles.push(buildFakeRole("NonGroupRoleOne"));
        fakeRoles.push(buildFakeRole("g-jizz"));
        fakeRoles.push(buildFakeRole("NonGroupRoleTwo"));
        fakeRoles.push(buildFakeRole("g-jazz"));
        stubs.getAllRoles.returns(fakeRoles)

        await process(fakeMessage);

        const sentMessage: string = stubs.sendToAuthor.getCall(0).args[0];

        assert.ok(sentMessage.includes("g-jizz"));
        assert.ok(sentMessage.includes("g-jazz"));
        assert.ok(!sentMessage.includes("NonGroupRoleOne"));
        assert.ok(!sentMessage.includes("NonGroupRoleTwo"));

    });
  });

  describe('members', function() {
    it('Lists out users in a group', async function() {
        fakeMessage.content = `!groups members ${fakeGroupName}`;
        stubs.findRole.returns(fakeRole);
        const users: Discord.GuildMember[] = [];

        users.push({nickname: 'BC'} as Discord.GuildMember);
        users.push({nickname: 'MrSticky'} as Discord.GuildMember);

        stubs.getUsersWithRole.returns(users);

        await process(fakeMessage);

        const sentToChannel: string = stubs.sendToAuthor.firstCall.args[0];
        assert.ok(sentToChannel.includes('BC'));
        assert.ok(sentToChannel.includes('MrSticky'));

    });
    it('Sends a different message when there are no users', async function() {
        fakeMessage.content = `!groups members ${fakeGroupName}`;
        stubs.findRole.returns(fakeRole);
        stubs.getUsersWithRole.returns([]);

        await process(fakeMessage);

        const sentToChannel: string = stubs.sendToAuthor.firstCall.args[0];
        assert.ok(sentToChannel.includes(`${fakeGroupName} has no members`));
    });
    it('Errors if the provided role doesn\'t exist', async function() {
        fakeMessage.content = `!groups members ${fakeGroupName}`;
        stubs.findRole.returns(null);
        

        await process(fakeMessage);

        sinon.assert.calledOnce(stubs.notifyAuthorOfFailure);
        sinon.assert.notCalled(stubs.sendToAuthor);
        sinon.assert.notCalled(stubs.getUsersWithRole) 
    });

  });
});

function buildFakeRole(roleName: string): Discord.Role {
    return { name: roleName } as Discord.Role
}

function getStubs(): definedStubs {
    return {
        createRole: sinon.stub(roles,"createRole"),
        findRole: sinon.stub(roles,"findRole"),
        addRoleToMembers: sinon.stub(roles,"addRoleToMembers"),
        removeRoleFromMembers: sinon.stub(roles,"removeRoleFromMembers"),
        tryDeleteRole: sinon.stub(roles, "tryDeleteRole"),
        getAllRoles: sinon.stub(roles,"getAllRoles"),
        getUsersWithRole: sinon.stub(roles,'getUsersWithRole'),
        notifyAuthorOfFailure: sinon.stub(util,"notifyAuthorOfFailure"),

        //Need to sub out these methods yourself
        sendToChannel: sinon.stub(),
        sendToAuthor: sinon.stub()
    }
}

type definedStubs = {
    createRole: sinon.SinonStub,
    findRole: sinon.SinonStub,
    addRoleToMembers: sinon.SinonStub,
    removeRoleFromMembers: sinon.SinonStub,
    tryDeleteRole: sinon.SinonStub,
    getAllRoles: sinon.SinonStub,
    getUsersWithRole: sinon.SinonStub,
    notifyAuthorOfFailure: sinon.SinonStub,

    sendToChannel: sinon.SinonStub,
    sendToAuthor: sinon.SinonStub
}