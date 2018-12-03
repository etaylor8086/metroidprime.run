import { Model } from './model';
import { UserModel } from './user';
import { DbConnector } from '../dbConnector';

export class GameModel extends Model {
    tableName = 'games';
    gameArticleTableName = 'games_articles';
    gameArticleCategoryTableName = 'games_articles_categories';
    connector = new DbConnector();

    getGames(done) {
        this.connector.knex.select('*')
            .from(this.tableName)
            .limit(10)
            .then(games => {
                return done(null, games);
            })
            .catch(err => {
                return done(err);
            });
    }

    getDetailedGameById(id, done) {
        this.getGameById(id)
            .then(game => {
                return done(null, game);
            })
            .catch(err => {
                return done(err);
            });
    }

    getGameById(id, columns?) {
        // Allow checking id or abbreviated name
        const column = isNaN(Number(id)) ? 'abbreviation' : 'id';
        const selectableColumns = columns ? columns : '*';

        return this.connector.knex.first(selectableColumns)
            .from(this.tableName)
            .where(column, id);
    }

    async getGameByIdSync(id, columns?) {
        // Allow checking id or abbreviated name
        const column = isNaN(Number(id)) ? 'abbreviation' : 'id';
        const selectableColumns = columns ? columns : '*';

        return await this.connector.knex.first(selectableColumns)
            .from(this.tableName)
            .where(column, id);
    }

    async getArticlesForGame(id, done) {
        const selectableColumns = ['id', 'name', 'title', 'description', 'categoryid as category',
            'last_updated_user', 'last_updated_date'];
        const user = new UserModel();
        let articles;

        // if id isn't numeric, get the id from the game via a game query
        if (isNaN(Number(id))) {
            const game = await this.getGameByIdSync(id);
            id = game.id;
        }

        this.connector.knex.select(selectableColumns)
            .from(this.gameArticleTableName)
            .where('gameid', id)
            .then(articleData => {
                articles = articleData;
                const updatedUsers = articles.map(article => article.last_updated_user);
                return user.getUsersByMultpleIds(updatedUsers);
            })
            .then(users => {
                articles.map(article => {
                    article.last_updated_user = users.find(userItem => userItem.id === article.last_updated_user);
                });
                const categories = articles.map(article => article.category);
                return this.connector.knex.select('*').from('games_articles_categories').whereIn('id', categories);
            })
            .then(categories => {
                articles.map(article => {
                    article.category = categories.find(categoryItem => categoryItem.id === article.category);
                });
                return done(null, articles);
            })
            .catch(err => {
                return done(err);
            });
    }
}
