#!/usr/local/bin/python
import csv
import json
import os

# jsondir = 'ExoplanetExplorer/app/data/planets'
jsonfile = open('ExoplanetExplorer/app/data/data.json', 'w')
csvfile = open('data.csv', 'rb')

# if not os.path.exists(jsondir):
#     os.makedirs(jsondir)

# API: http://exoplanetarchive.ipac.caltech.edu/docs/API_exoplanet_columns.html

# earth-like
# http://www.space.com/30172-six-most-earth-like-alien-planets.html

# potentially habitable
# https://en.wikipedia.org/wiki/List_of_potentially_habitable_exoplanets

fieldnames = ['pl_name','pl_rade','pl_masse','pl_radj','pl_massj','pl_dens','st_dist','pl_disc','pl_telescope','pl_eqt','pl_discmethod','pl_facility','pl_mnum','pl_pelink','pl_edelink','pl_cbflag','pl_orbper','pl_pnum','ra','dec','st_spstr','st_age','pl_ratdor','st_rad','rowupdate']
reader = csv.DictReader(csvfile, fieldnames)

output = "["

for row in reader:
    # jsonfile = open(jsondir + '/' + row['pl_name'].replace(' ', '') + '.json', 'w+')
    if reader.line_num == 1:
        continue
    output = output + json.dumps(row, separators=(',',':')) + ","

output = output[0:-1]
output = output + "]"

all_data = json.loads(output)

keys_to_delete = []

# kill empty data
for row in all_data:
    line = all_data.index(row)
    for key in row:
        if row[key] == "":
            keys_to_delete.append({"row": line, "key": key})

for i in keys_to_delete:
    obj = all_data[i["row"]]
    obj.pop(i["key"], None)

out = json.dumps(all_data)

jsonfile.write(out)