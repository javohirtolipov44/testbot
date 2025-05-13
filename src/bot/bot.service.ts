import { Update, Ctx, Start, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';

interface UserSession {
  name?: string;
  botNumber?: number;
  attempt: number;
}

const userStates = new Map<number, UserSession>();

@Update()
export class BotUpdate {
  @Start()
  async start(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id as number;
    userStates.set(chatId, { attempt: 0 });
    await ctx.reply('Salom! Ismingizni kiriting:');
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id as number;
    const message = ctx.message?.['text'];
    const session = userStates.get(chatId);

    if (!session) {
      await ctx.reply("Iltimos /start buyrug'ini bosing.");
      return;
    }

    // 1-qadam: ismini olish
    if (!session.name) {
      session.name = message;
      let randomNumber = Math.floor(Math.random() * 9) + 1;
      if (randomNumber === 5) {
        randomNumber = Math.floor(Math.random() * 9) + 1;
      }
      session.botNumber = randomNumber;
      await ctx.reply(
        `<b>Rahmat, ${session.name}.\nMen bir xonali son o'yladim. 3 ta urinishda topishga harakat qiling.\nJavobingizni kiriting:</b>`,
        { parse_mode: 'HTML' }
      );
      return;
    }

    // Javob tekshirish
    const userNumber = +message;
    if (isNaN(userNumber) || userNumber < 1 || userNumber > 9) {
      await ctx.reply('Iltimos, 1 dan 9 gacha bo‘lgan butun raqam kiriting.');
      return;
    }

    session.attempt++;

    if (userNumber === session.botNumber) {
      await ctx.reply(
        `Tabriklayman, siz men o'ylagan ${session.botNumber} sonini topdingiz! 😊\nYana o'ynashni istasangiz /start buyrug'ini bosing.`
      );
      userStates.delete(chatId);
      return;
    }

    // Yordamchi javoblar
    let hint = '';
    if (session.attempt === 1) {
      hint =
        userNumber > session.botNumber!
          ? "Sizning raqamingiz katta, yana urinib ko'ring."
          : "Sizning raqamingiz kichik, yana urinib ko'ring.";
    } else if (session.attempt === 2) {
      hint =
        session.botNumber! < 5
          ? "Men o'ylagan son 5 dan kichik."
          : "Men o'ylagan son 5 dan katta.";
    } else if (session.attempt === 3) {
      hint =
        session.botNumber! % 2 === 0
          ? "Men o'ylagan son juft son."
          : "Men o'ylagan son toq son.";
    }

    if (session.attempt < 4) {
      await ctx.reply(`${hint} Yana urinib ko‘ring.`);
    } else {
      await ctx.reply(
        `Afsus, topolmadingiz. Men ${session.botNumber} sonini o‘ylagan edim.\nYana o'ynashni istasangiz /start buyrug'ini bosing.`
      );
      userStates.delete(chatId);
    }
  }
}
