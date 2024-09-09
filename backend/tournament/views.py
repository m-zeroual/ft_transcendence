from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Tournament
from .serializers import TournamentSerializer
from django.views.decorators.csrf import csrf_exempt
from Player.Models.PlayerModel import Player
from rest_framework import status
from rest_framework.parsers import JSONParser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes



# Create your views here.

def index(request):
    return HttpResponse("Tournament")

def list_tournaments(request):
    if request.method == 'GET':
        try:
            Tournaments = Tournament.objects.all()
            serializer  = TournamentSerializer(Tournaments, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def get_tournament_by_id(request, tournamentId):
    try:
        tournament = Tournament.objects.get(tournament_id=tournamentId)
    except Tournament.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Tournament not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = TournamentSerializer(tournament)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# def get_start_date(request, tournamentId):
#     if request.method == 'GET':
#         try:
#             Tournament = Tournament.objects.get(id=tournamentId)
#             serializer  = TournamentSerializer(Tournaments, many=True)
#             return JsonResponse(serializer.data, safe=False, status=200)
#         except Exception as e:
#             return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
#     return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)



@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def player_join_tournament(request, tournamentId):
    if request.method == 'POST':
        try:
            player = Player.objects.get(user=request.user)
            tournament = Tournament.objects.get(tournament_id=tournamentId)
            if not tournament.can_join:
                return JsonResponse({'statusText': 'Tournament is not open for new players'}, status=400)
            if player in tournament.players.all():
                return JsonResponse({'statusText': 'Player is already in the tournament'}, status=400)

            tournament.players.add(player)
            tournament.save()
            serializer = TournamentSerializer(tournament)
            # Send a message to the WebSocket group
            channel_layer = get_channel_layer()
            tournament_name = "Tournament"
            room_group_name = f'tournament_{tournament_name}'
            
            async_to_sync(channel_layer.group_send)(
                room_group_name,
                {
                    'type': 'tournament_message',
                    'message': 'A new tournament has been created!',
                    'dataTest': serializer.data,
                    'join': True
                }
            )
            if tournament.players.count() >= tournament.number_of_players:
                tournament.can_join = False
                tournament.save()
                # launch_tournament(tournament) # here call launch_tournament function
                # return JsonResponse(serializer.data, status=status.HTTP_200_OK)
                # return JsonResponse({'success': launch_tournament(tournament)}, status=200)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
            # return JsonResponse({'success': 'Player successfully joined the tournament'}, status=200)
        except Player.DoesNotExist:
            return JsonResponse({'statusText': 'Player not found'}, status=404)
        except Tournament.DoesNotExist:
            return JsonResponse({'statusText': 'Tournament not found'}, status=404)
    return JsonResponse({'statusText': 'Invalid request method'}, status=405)

@csrf_exempt
def SetStartDate(request):
    if request.method == 'PUT':
        try:
            data = JSONParser().parse(request)
            tournamentId = data.get('tournamentId')
            start_date = data.get('start_date')
            tournament = Tournament.objects.get(id=tournamentId)
            print("\nhere\n")
            next_stage = data.get('next_stage')
            print("\n")
            print(next_stage)
            print("\n")
            if tournament.start_date and not next_stage:
                return JsonResponse({'warning': 'start date already updated !'}, safe=False, status=200)
            tournament.start_date = start_date
            tournament.save()
            return JsonResponse('start date is updated !', safe=False, status=200)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_tournaments_by_player_id(request):
    try:
        player = Player.objects.get(user=request.user)
    except Player.DoesNotExist:
        return JsonResponse({'error': 'Player not found'})
    
    tournaments = player.tournaments.all()  # Get all tournaments associated with the player
    serializer = TournamentSerializer(tournaments, many=True)
    return JsonResponse(serializer.data, safe=False)

def get_available_tournaments(request):
    if request.method == 'GET':

        tournamentName = request.GET.get("tournament_name")
        tournamentId = request.GET.get("tournament_id")
        
        if tournamentId and tournamentName:
            tournaments = Tournament.objects.filter(can_join=True, tournament_id=tournamentId, tournament_name__contains=tournamentName)
        elif tournamentId : 
            tournaments = Tournament.objects.filter(can_join=True, tournament_id=tournamentId)
        elif tournamentName : 
            tournaments = Tournament.objects.filter(can_join=True, tournament_name__contains=tournamentName)
        else :
            tournaments = Tournament.objects.filter(can_join=True)

        serializer = TournamentSerializer(tournaments, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


# @csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def create_tournament(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print(data)
        # tournament = Tournament.objects.create(tournament_name=data.tournament_name, number_of_players=data.number_of_players, is_accessible=data.is_accessible,
        # access_password=data.access_password)

        # player = Player.objects.get(id=player_id)
        # data.owner = player
        # print("===\n")
        # print(data)
        # print("====\n")


        # player = Player.objects.get(id=player_id)
        # tournament.players.add(player)
        # tournament.owner = player
        # tournament.save()
        # return JsonResponse({'status': 'success', 'tournament': "Created"}, status=201)



        serializer = TournamentSerializer(data=data)
        if serializer.is_valid():
            tournament = serializer.save()
            print("\nheeere\n")
            player = Player.objects.get(user=request.user)
            tournament.players.add(player)
            tournament.owner = player
            tournament.save()

            # tournaments = Tournament.objects.filter(can_join=True)
            # serializers = TournamentSerializer(tournaments, many=True)

            # Send a message to the WebSocket group
            channel_layer = get_channel_layer()
            tournament_name = "Tournament"
            room_group_name = f'tournament_{tournament_name}'
            
            async_to_sync(channel_layer.group_send)(
                room_group_name,
                {
                    'type': 'tournament_message',
                    'message': 'A new tournament has been created!',
                    'dataTest': serializer.data,
                    'join': False
                }
            )
            return JsonResponse({'status': 'success', 'tournament': serializer.data}, status=201)
        print(serializer.errors)
        # logger.debug("Validation errors:", serializer.errors)
        return JsonResponse({'status': 'error', 'errors': serializer.errors}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def player_leave_tournament(request, tournamentId):
    if request.method == 'POST':
        try:
            player = Player.objects.get(user=request.user)
            tournament = Tournament.objects.get(tournament_id=tournamentId)
            # if not tournament.can_join:
            #     return JsonResponse({'statusText': 'Tournament is not open for new players'}, status=400)

            # if player not in tournament.players.all():
            #     return JsonResponse({'statusText': 'Player is not in the tournament'}, status=400)

            # tournament.players.add(player)
            tournament.players.remove(player)
            tournament.save()
            # if tournament.players.count() >= tournament.number_of_players:
            #     tournament.can_join = False
            #     tournament.save()
                # launch_tournament(tournament) # here call launch_tournament function
                # return JsonResponse({'success': launch_tournament(tournament)}, status=200)
            return JsonResponse({'success': 'Player successfully leaved the tournament'}, status=200)
        except Player.DoesNotExist:
            return JsonResponse({'statusText': 'Player not found'}, status=404)
        except Tournament.DoesNotExist:
            return JsonResponse({'statusText': 'Tournament not found'}, status=404)
    return JsonResponse({'statusText': 'Invalid request method'}, status=405)

# def get_tournament_by_id(request, id):
#     try:
#         tournament = Tournament.objects.get(id=id)
#     except Tournament.DoesNotExist:
#         return JsonResponse({'status': 'error', 'message': 'Tournament not found'}, status=status.HTTP_404_NOT_FOUND)
#     if request.method == 'GET':
#         serializer = TournamentSerializer(tournament)
#         return JsonResponse(serializer.data, status=status.HTTP_200_OK)
#     return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
