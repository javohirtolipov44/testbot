import { log } from 'console';
import { Update, Ctx, On, Start, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';

interface UserSession {
  step: number;
  name?: string;
  userAnswer?: number;
  botNumber?: number;
}

const userStates = new Map<number, UserSession>();

@Update()
export class BotUpdate {
  @Start()
  async start(@Ctx() ctx: Context) {
    log(ctx.state);
    const chatId = ctx.chat?.id as number;
    userStates.set(chatId, { step: 1 });
    await ctx.reply('Salom! Ismingizni kiriting:');
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id as number;
    const message = ctx.message?.['text'];
    const session = userStates.get(chatId);
    let randomNumber = Math.floor(Math.random() * 9) + 1;
    if (randomNumber === 5) {
      randomNumber = Math.floor(Math.random() * 9) + 1;
    }
    if (!session) {
      await ctx.reply("Iltimos /start buyrug'ini bosing.");
      return;
    }

    if (session.step === 1) {
      session.name = message;
      session.botNumber = randomNumber;
      await ctx.reply(
        `<b>Rahmat, ${session.name}.\nMen bir xonali son o'yladim 3 ta urinishda topishga harakat qiling.\nJavobingizni kiriting:</b>`,
        {
          parse_mode: 'HTML',
        },
      );
      session.step = 2;
      log(session);
    } else if (session.step === 2) {
      if (isNaN(+message))
        await ctx.reply('Iltimos, bir xonali raqam kiriting.');
      if (+message === session.botNumber) {
        await ctx.reply(
          `Tabriklayman, siz men o'ylagan ${session.botNumber} sonini topdingiz! Yana o'ynashni istasangiz /start buyrug'ini bosing.`,
        );
      } else {
        if (session.botNumber !== undefined && +message > session.botNumber) {
          await ctx.reply("Sizning raqamingiz katta, yana urinib ko'ring.");
        } else if (
          session.botNumber !== undefined &&
          +message < session.botNumber
        ) {
          await ctx.reply("Sizning raqamingiz kichik, yana urinib ko'ring.");
        }
      }
      session.step = 3;
      session.userAnswer = 1;
    } else if (session.step === 3) {
      if (isNaN(+message))
        await ctx.reply('Iltimos, bir xonali raqam kiriting.');
      if (+message === session.botNumber) {
        await ctx.reply(
          `Tabriklayman, siz men o'ylagan ${session.botNumber} sonini topdingiz! Yana o'ynashni istasangiz /start buyrug'ini bosing.`,
        );
      } else {
        if (session.botNumber !== undefined && 5 > session.botNumber) {
          await ctx.reply(
            "Mayli sizga yordam beraman men o'ylagan son 5 dan kichik, yana urinib ko'ring.",
          );
        } else if (session.botNumber !== undefined && 5 < session.botNumber) {
          await ctx.reply(
            "Mayli sizga yordam beraman men o'ylagan son 5 dan katta, yana urinib ko'ring.",
          );
        }
      }
      session.step = 4;
      session.userAnswer = 2;
    } else if (session.step === 4) {
      if (isNaN(+message))
        await ctx.reply('Iltimos, bir xonali raqam kiriting.');
      if (+message === session.botNumber) {
        await ctx.reply(
          `Tabriklayman, siz men o'ylagan ${session.botNumber} sonini topdingiz! Yana o'ynashni istasangiz /start buyrug'ini bosing.`,
        );
      } else {
        if (session.botNumber !== undefined && session.botNumber % 2 === 0) {
          await ctx.reply(
            "Mayli sizga yordam beraman men o'ylagan son juft son, yana urinib ko'ring.",
          );
        } else if (
          session.botNumber !== undefined &&
          session.botNumber % 2 === 1
        ) {
          await ctx.reply(
            "Mayli sizga yordam beraman men o'ylagan son toq son, yana urinib ko'ring.",
          );
        }
      }
      session.step = 5;
      session.userAnswer = 3;
    } else if (session.step === 5) {
      if (isNaN(+message))
        await ctx.reply('Iltimos, bir xonali raqam kiriting.');
      if (+message === session.botNumber) {
        await ctx.reply(
          `Tabriklayman, siz men o'ylagan ${session.botNumber} sonini topdingiz! Yana o'ynashni istasangiz \n/start buyrug'ini bosing.`,
        );
      } else {
        await ctx.reply(
          `Afsus topolmadingiz ${session.botNumber} sonini o'ylagan edim! Yana o'ynashni istasangiz \n/start buyrug'ini bosing.`,
        );
      }
    }
  }
}
