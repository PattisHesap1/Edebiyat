from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import Yazar,Kitap,Dergi,Siir
import datetime

# Create your views here.
def index(request):

    dergi = Dergi.objects.all()
    kitap = Kitap.objects.all()
    yazar = Yazar.objects.all()
    siir = Siir.objects.all()

    zam = datetime.datetime.now()
    zam = zam.strftime("%m")
    aylar = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"]
    buay = aylar[int(zam)+1]
    
    template = loader.get_template("index/index.html")
    context={
        "DERGI":dergi,
        "KITAP":kitap,
        "YAZAR":yazar,
        "SIIR":siir,
        "AY":buay
    }
    return HttpResponse(template.render(context, request))