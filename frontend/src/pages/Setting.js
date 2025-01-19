import React from 'react'
import { Link } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { RxCross2 } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";

import { baseUrl } from '../utils/url.js';

const Setting = () => {

  const queryClient = useQueryClient();

  // Make a logout and delete a user cookie in backend
  const {mutate: logout} = useMutation({
    mutationFn : async () => {
      try {
        const res = await fetch (`${baseUrl}/api/auth/logout`,{
          method : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "something went wrong")
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: ()=>{
      toast.success("Log out successfully")
      queryClient.invalidateQueries({
        queryKey : ["authUser"]
      })
    }
  })

  return (
    <div className='flex justify-between min-h-screen h-auto w-screen bg-blue-400 flex-col p-[5%]'>
      <div className='flex justify-between'>
        <h1 className='font-bold font-serif text-xl md:text-3xl lg:text-5xl'>Setting</h1>
        <button onClick={(e)=>{
          e.preventDefault();}} className='flex justify-end font-bold font-serif text-lg md:text-2xl lg:text-4xl'>
          <Link to="/">
            <RxCross2 />
          </Link>
        </button>
      </div>
      <div className='font-bold font-serif'>
        <div>
          <h3 className='text-lg md:text-2xl lg:text-4xl'>
            How To Play
          </h3>
          <details>
            <summary className='text-base md:text-xl lg:text-3xl'>
              Chess Game Rules
            </summary>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>
                Objectives
              </h5>
              <p className='text-xs md:text-base lg:text-xl'>
                The main goal of chess is to checkmate your opponent’s king. This means putting the opponent’s king in a position where it is under attack (in check) and there is no legal move to escape the threat.
              </p>
            </div>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>
                Moves
              </h5>
              <ul>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Pawns:</h6>
                  <p className='text-xs md:text-base lg:text-xl'>move forward one square, but capture diagonally. On their first move, they can move two squares.</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Knights:</h6>
                  <p className='text-xs md:text-base lg:text-xl'> move in an "L" shape (two squares in one direction, then one square perpendicular).</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Bishops:</h6>
                  <p className='text-xs md:text-base lg:text-xl'>move diagonally, as many squares as possible</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Rooks:</h6>
                  <p className='text-xs md:text-base lg:text-xl'> move horizontally or vertically, as many squares as possible.</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Queen:</h6>
                  <p className='text-xs md:text-base lg:text-xl'>combine the movement of both the Rook and the Bishop.</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>King:</h6>
                  <p className='text-xs md:text-base lg:text-xl'>move one square in any direction, but cannot move into check.</p>
                </li>
              </ul>
            </div>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>Promotion</h5>
              <p className='text-xs md:text-base lg:text-xl'>when a pawn reaches the opponent's back rank (the 8th rank for White or the 1st rank for Black), it can be promoted to one of four pieces: a queen, rook, bishop, or knight. While most players choose to promote the pawn to a queen due to its power, promoting to a rook, bishop, or knight may be strategic, such as to avoid a stalemate or to gain a tactical advantage in specific situations.</p>
            </div>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>Game Over</h5>
              <ul>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Checkmate:</h6>
                  <p className='text-xs md:text-base lg:text-xl'> The opponent's king is in check (threatened with capture) and there is no legal move to escape the threat. This ends the game with the checkmating player winning.</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Stalemate:</h6>
                  <p className='text-xs md:text-base lg:text-xl'>The player whose turn it is has no legal moves and their king is not in check. This results in a draw.</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Insufficient Material:</h6>
                  <p className='text-xs md:text-base lg:text-xl'> The game can end in a draw if neither player has enough pieces to checkmate the opponent. For example, a king against a king, or a king and a bishop against a king.</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Threefold Repetition:</h6>
                  <p className='text-xs md:text-base lg:text-xl'> If the same position is repeated three times with the same player to move and the same possible moves available, the game can be declared a draw by either player.</p>
                </li>
                <li>
                  <h6 className='text-sm md:text-lg lg:text-2xl'>Fifty-move Rule:</h6>
                  <p className='text-xs md:text-base lg:text-xl'>If 50 consecutive moves are made by both players without any pawn movement or capture, either player can claim a draw.</p>
                </li>
              </ul>
            </div>
          </details>
          <details>
            <summary className='text-base md:text-xl lg:text-3xl'>TicTacToe Rules</summary>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>Objectives</h5>
              <p className='text-xs md:text-base lg:text-xl'>The goal is to be the first player to get three of your marks (either X or O) in a row, column, or diagonal on a 3x3 grid.</p>
            </div>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>Game Play</h5>
              <p className='text-xs md:text-base lg:text-xl'>The game starts with an empty 3x3 grid. Players take turns placing their symbol (X or O) in one of the empty cells. A player wins when they have three of their symbols in a row, column, or diagonal.  If all the cells are filled and no player has won, the game is a draw (also known as a "tie").</p>
            </div>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>Win Condition</h5>
              <p className='text-xs md:text-base lg:text-xl'>Three X's or O's in a horizontal row. Three X's or O's in a vertical column. Three X's or O's in a diagonal (from top-left to bottom-right or top-right to bottom-left).</p>
            </div>
            <div>
              <h5 className='text-sm md:text-lg lg:text-2xl'>Game Over</h5>
              <p className='text-xs md:text-base lg:text-xl'>We think this game mostly tie so it's only disappoint players so we add 7 matches rule that mean after playing 7 matches only this game get over until your and opponent’s wins and tie matches get calculate so winner is who get most wins in 7 matches</p>
            </div>
          </details>
        </div>
        <hr></hr>
        <div>
          <h3 className='text-lg md:text-2xl lg:text-4xl'>Advantage & Disadvantage in Games</h3>
          <details>
            <summary className='text-base md:text-xl lg:text-3xl'>Advantage of Playing Video Games</summary>
            <ul>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Improved Cognitive Skills:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Many games require critical thinking, problem-solving, and decision-making, which can enhance cognitive functions like memory, attention, and reaction time.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Hand-Eye Coordination:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Action and simulation games can improve hand-eye coordination as players need to control the game using both their hands and their eyes simultaneousl</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Stress Relief:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Video games can offer an escape and a form of relaxation, helping to reduce stress and anxiety for some people by engaging them in a world outside of their real-life worries.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Social Connections:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Multiplayer and online games allow players to connect with friends or strangers worldwide, fostering teamwork, collaboration, and communication skills.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Entertainment and Creativity:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Games can be a source of entertainment and creativity, with many games offering storylines, worlds, and environments that inspire imagination and creativity.</p>
              </li>
            </ul>
          </details>
          <details>
            <summary className='text-base md:text-xl lg:text-3xl'>Disadvantage of Playing Video Games</summary>
            <ul>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Addiction:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Excessive gaming can lead to addiction, where a player prioritizes gaming over other important activities like work, studies, or social interaction.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Physical Health Issues:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Long hours of gaming can contribute to poor posture, eye strain, and sedentary behavior, potentially leading to problems like back pain, carpal tunnel syndrome, and obesity.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Violence and Aggression:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Some studies suggest that playing violent video games may increase aggression or desensitize players to violence, although the evidence is mixed and context-dependent.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Reduced Academic or Work Performance:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Spending too much time gaming can interfere with academic performance or work productivity, especially if it leads to procrastination or lack of focus.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Cost:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Video games, consoles, and in-game purchases can be expensive, leading to financial strain, especially for those who frequently invest in new games or upgrades.</p>
              </li>
            </ul>
          </details>
        </div>
        <hr></hr>
        <div>
          <h3 className='text-lg md:text-2xl lg:text-4xl'>How to make Game Useful</h3>
          <details>
            <summary className='text-base md:text-xl lg:text-3xl'>Game Streaming</summary>
            <ol>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 1 - Start a YouTube or Twitch Channel:</h4>
                <p className='text-xs md:text-base lg:text-xl'>If you have a deep understanding of particular games or genres, consider creating content around your gameplay. You can provide tips, tutorials, or entertainment through livestreams, Let’s Plays, or game reviews. Many gamers have turned streaming into a career by engaging with audiences and monetizing through ads, donations, and sponsorships.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 2 - Create Game Guides and Tutorials:</h4>
                <p className='text-xs md:text-base lg:text-xl'>With your knowledge of games, you could write or create video guides for beginners or advanced players. These could be about strategies, tips, hidden secrets, or walkthroughs of difficult levels or bosses.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 3 - Develop a Blog or Website:</h4>
                <p className='text-xs md:text-base lg:text-xl'>If you're passionate about gaming, consider starting a blog or website to share your thoughts, game reviews, and gaming-related news. This can be a platform where you express your opinions on game mechanics, industry trends, or even upcoming releases.</p>
              </li>
            </ol>
          </details>
          <details>
            <summary className='text-base md:text-xl lg:text-3xl'>Game Development</summary>
            <ol>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 1 - Learn Game Development:</h4>
                <p className='text-xs md:text-base lg:text-xl'>If you enjoy understanding the mechanics of how games work, you can translate your gaming knowledge into game design. Learn coding, programming, or game development platforms like Unity or Unreal Engine, and start creating your own games. Your experience as a player will give you insight into what makes games fun or frustrating.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 2 - Level Design:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Many game designers come from backgrounds of playing and understanding what makes a level challenging and enjoyable. If you're skilled at analyzing game environments, consider focusing on level design or environment art.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 3 - Beta Testing and Game QA:</h4>
                <p className='text-xs md:text-base lg:text-xl'>Game developers often hire skilled players to help with beta testing or quality assurance (QA). Your extensive gaming knowledge can make you a valuable asset in identifying bugs, inconsistencies, or improving game mechanics during development.</p>
              </li>
            </ol>
          </details>
          <details>
            <summary className='text-base md:text-xl lg:text-3xl'>Esports</summary>
            <ol>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 1 - Join Esports:</h4>
                <p className='text-xs md:text-base lg:text-xl'>If you have significant skill in competitive games (e.g., League of Legends, Dota 2, Overwatch, Fortnite), you can consider participating in esports tournaments. Many professional gamers make a living through tournament winnings, sponsorships, and streaming.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 2 - Coaching and Mentorship:</h4>
                <p className='text-xs md:text-base lg:text-xl'>If you're highly skilled in a specific game, you could offer coaching services to others who want to improve. Many platforms allow you to become a professional coach in games like FIFA, Valorant, or Apex Legends. Coaching involves teaching strategies, improving mechanics, and analyzing gameplay to help others reach a higher level.</p>
              </li>
              <li>
                <h4 className='text-base md:text-xl lg:text-3xl'>Step 3 - Game Analyst:</h4>
                <p className='text-xs md:text-base lg:text-xl'>In the esports world, analysts break down professional matches to identify trends, strategies, and key moments. With your in-depth knowledge of game mechanics and competitive play, you could work as an analyst for a team or tournament.</p>
              </li>
            </ol>
          </details>
        </div>
      </div>
      <button onClick={(e)=>{
        e.preventDefault();
        logout();
      }} className='btn rounded-full bg-blue-500 text-black dark:text-white text-sm sm:text-sm md:text-base lg:text:lg font-serif shadow-md hover:bg-blue-600 active:bg-blue-700 border-0'>
        <Link to="/login" className='flex gap-5'>
        logout <TbLogout className='text-lg sm:text-lg md:text-xl lg:text-2xl'/>
        </Link> {/*after logout navigate back to login page */}
      </button>
    </div>
  )
}

export default Setting;