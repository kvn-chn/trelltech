import axios from "axios";
import { API_KEY, TOKEN } from '@env';

export const createWorkspace = async (workspaceName) => {
    try {
        const response = await axios.post('https://api.trello.com/1/organizations', {
        displayName: workspaceName,
        key: API_KEY,
        token: TOKEN,
        });
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const updateWorkspaceName = async (workspaceId, newWorkspaceName) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/organizations/${workspaceId}`, {
        displayName: newWorkspaceName,
        key: API_KEY,
        token: TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const deleteWorkspace = async (workspaceId) => {
    try {
        await axios.delete(`https://api.trello.com/1/organizations/${workspaceId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getWorkspace = async (workspaceId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/organizations/${workspaceId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
}

export const getWorkspaces = async () => {
    try {
        const response = await axios.get('https://api.trello.com/1/members/me/organizations', {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getWorkspaceMembers = async (workspaceId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/organizations/${workspaceId}/members`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
}

export const createBoard = async (boardName) => {
  try {
    const response = await axios.post('https://api.trello.com/1/boards', {
      name: boardName,
      key: API_KEY,
      token: TOKEN,
    });
    return response.data;
  } catch (error) {
    console.error(error, error.response.data)
  }
}

export const createBoardInWorkspace = async (boardName, workspaceId) => {
    try {
        const response = await axios.post('https://api.trello.com/1/boards', {
            name: boardName,
            idOrganization: workspaceId,
            key: API_KEY,
            token: TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const createBoardWithTemplate = async (boardName, workspaceId ,templateId) => {
    try {
        const response = await axios.post('https://api.trello.com/1/boards', {
            name: boardName,
            idOrganization: workspaceId,
            idBoardSource: templateId,
            key: API_KEY,
            token: TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getTemplateBoards = async() =>{
    try {
        const response = await axios.get(`https://trello.com/1/batch?urls=%2F1%2Fboard%2F5c4efa1d25a9692173830e7f%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5ec98d97f98409568dd89dff%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5994bf29195fa87fb9f27709%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5e6005043fbdb55d9781821e%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5b78b8c106c63923ffe26520%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5aaafd432693e874ec11495c%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F591ca6422428d5f5b2794aee%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5994be8ce20c9b37589141c2%3Ffields%3Did%252Cname%252Cprefs`);
        return response.data;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

export const updateBoard = async (boardId, newBoardName) => {
  try {
    const response = await axios.put(`https://api.trello.com/1/boards/${boardId}`, {
        name: newBoardName,
        key: API_KEY,
        token: TOKEN,
    });
    return response.data;
  } catch (error) {
    console.error(error, error.response.data)
  }
};

export const deleteBoard = async (boardId) => {
    try {
        const response = await axios.delete(`https://api.trello.com/1/boards/${boardId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getBoards = async () => {
    try {
        const response = await axios.get('https://api.trello.com/1/members/me/boards', {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getBoard = async (boardId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/boards/${boardId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
}

export const getBoardsInWorkspace = async (workspaceId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/organizations/${workspaceId}/boards`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getMember = async (memberId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/members/${memberId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getMembersInBoard = async (boardId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/members`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getMembers = async (boardId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/members`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getLists = async (boardId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getCard = async (cardId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/cards/${cardId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
}

export const getCards = async (boardId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/lists/${boardId}/cards`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getCardsInBoards = async (boardId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/cards`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const getCardsInList = async (listId) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/lists/${listId}/cards`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const createList = async (boardId, listName) => {
    try {
        const response = await axios.post(`https://api.trello.com/1/boards/${boardId}/lists`, {
        name: listName,
        key: API_KEY,
        token: TOKEN,
        });
        return response.data;
    }
    catch (error) {
        console.error(error, error.response.data)
    }
};

export const createCard = async (listId, cardName) => {
    try {
        const response = await axios.post(`https://api.trello.com/1/cards`, {
        name: cardName,
        idList: listId,
        key: API_KEY,
        token: TOKEN,
        });
        return response.data;
    }
    catch (error) {
        console.error(error, error.response.data)
    }
};

export const createCardInList = async (cardName, cardDescription, listId) => {
    try {
        const response = await axios.post(`https://api.trello.com/1/cards`, {
        name: cardName,
        desc: cardDescription,
        idList: listId,
        key: API_KEY,
        token: TOKEN,
        });
        return response.data;
    }
    catch (error) {
        console.error(error, error.response.data)
    }
};

export const updateCard = async (cardId, newCardName) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/cards/${cardId}`, {
        name: newCardName,
        }, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const deleteCard = async (cardId) => {
    try {
        await axios.delete(`https://api.trello.com/1/cards/${cardId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const archiveList = async (listId) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/lists/${listId}/closed`, {
            value: true,
            key: API_KEY,
            token: TOKEN,

        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const updateList = async (listId, newListName) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/lists/${listId}`, {
        name: newListName,
        }, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const addMemberToWorkspace = async (workspaceId, memberId) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/organizations/${workspaceId}/members/${memberId}?key=${API_KEY}&token=${TOKEN}&type=normal`);
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const removeMemberFromWorkspace = async (workspaceId, memberId) => {
    try {
        const response = await axios.delete(`https://api.trello.com/1/organizations/${workspaceId}/members/${memberId}?key=${API_KEY}&token=${TOKEN}`);
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
}

export const addMemberToBoard = async (boardId, memberId) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/boards/${boardId}/members/${memberId}`, {}, {
            params: {
                type: 'admin',
                key: API_KEY,
                token: TOKEN,
            },
        });
        //const response = await axios.put(`https://api.trello.com/1/boards/${boardId}/members/${memberId}?type=admin&key=${API_KEY}&token=${TOKEN}`)
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const removeMemberFromBoard = async (boardId, memberId) => {
    try {
        const response = await axios.delete(`https://api.trello.com/1/boards/${boardId}/members/${memberId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const addMemberToCard = async (cardId, memberId) => {
    try {
        const response = await axios.post(`https://api.trello.com/1/cards/${cardId}/idMembers`, {
            value: memberId,
            key: API_KEY,
            token: TOKEN,
        });
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const removeMemberFromCard = async (cardId, memberId) => {
    try {
        const response = await axios.delete(`https://api.trello.com/1/cards/${cardId}/idMembers/${memberId}`, {
        params: {
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const updateCardDescription = async (cardId, newCardDescription) => {
    try {
        const response = await axios.put(`https://api.trello.com/1/cards/${cardId}`, {
        desc: newCardDescription,
        key: API_KEY,
        token: TOKEN,
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
}

export const searchMembers = async (query) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/search/members`, {
        params: {
            query: query,
            key: API_KEY,
            token: TOKEN,
        },
        });
        return response.data;
    } catch (error) {
        console.error(error, error.response.data)
    }
};

export const searchCards = async (query) => {
    try {
        const response = await axios.get(`https://api.trello.com/1/search`, {
            params: {
                query: query,
                modelTypes: 'cards',
                card_fields: 'all',
                key: API_KEY,
                token: TOKEN,
            },
        });
        return response.data.cards;
    } catch (error) {
        console.error(error, error.response.data)
    }
}