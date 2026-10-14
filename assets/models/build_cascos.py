import os
import bpy
import bmesh
from mathutils import Vector

OUT = r"C:\Users\mmyzx\Documents\GitHub\barcos\assets\models"
SHOTS = os.path.join(OUT, "captures")
os.makedirs(SHOTS, exist_ok=True)

WOOD = 0
SAIL = 1
LINEN = 2
TAR = 3
METAL = 4
FLAG_FISH = 5
FLAG_CARGO = 6
ACCENT = 7
WATER = 8
COAST = 9

PALETTE = [
    ("MAT_Madera", "7A4F34", 0.0, 0.86),
    ("MAT_Espuma", "E4DFD4", 0.0, 0.72),
    ("MAT_Lino", "C8B892", 0.0, 0.84),
    ("MAT_Alquitran", "4E4943", 0.0, 0.9),
    ("MAT_Metal", "8B9094", 0.35, 0.58),
    ("MAT_BanderaPesca", "5E8A72", 0.0, 0.8),
    ("MAT_BanderaCarga", "2F5E68", 0.0, 0.8),
    ("MAT_Acento", "C4922A", 0.0, 0.62),
    ("MAT_Agua", "143646", 0.0, 0.55),
    ("MAT_Costa", "3E7A84", 0.0, 0.6),
]


def set_color(node, hex_color, metallic, roughness):
    rgb = tuple(int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4)) + (1,)
    for socket in node.inputs:
        label = (socket.identifier + " " + socket.name).lower()
        if "base" in label and "color" in label:
            socket.default_value = rgb
        elif "metallic" in label:
            socket.default_value = metallic
        elif "rough" in label:
            socket.default_value = roughness


def make_material(name, hex_color, metallic, roughness):
    mat = bpy.data.materials.get(name)
    if mat is None:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    set_color(bsdf, hex_color, metallic, roughness)
    mat.diffuse_color = tuple(int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4)) + (1,)
    return mat


materials = [make_material(*item) for item in PALETTE]


def assign(obj):
    obj.data.materials.clear()
    for mat in materials:
        obj.data.materials.append(mat)


def new_bmesh():
    bm = bmesh.new()
    return bm


def face(bm, verts, mat_index):
    poly = bm.faces.new(verts)
    poly.material_index = mat_index
    return poly


def box(bm, x0, x1, y0, y1, z0, z1, mat_index):
    verts = [bm.verts.new(corner) for corner in (
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
        (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
    )]
    quads = (
        (0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
        (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0),
    )
    for quad in quads:
        face(bm, [verts[index] for index in quad], mat_index)


def oriented_box(bm, origin, axis, length, width, height, mat_index):
    axis = axis.normalized()
    side = axis.cross(Vector((0, 0, 1)))
    if side.length < 0.001:
        side = axis.cross(Vector((1, 0, 0)))
    side.normalize()
    up = side.cross(axis).normalized()
    origin = Vector(origin)
    corners = []
    for along in (0, length):
        for across in (-width / 2, width / 2):
            for vertical in (-height / 2, height / 2):
                corners.append(origin + axis * along + side * across + up * vertical)
    order = (0, 1, 3, 2, 4, 5, 7, 6)
    verts = [bm.verts.new(corners[index]) for index in order]
    quads = (
        (0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
        (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0),
    )
    for quad in quads:
        face(bm, [verts[index] for index in quad], mat_index)


def hull(bm, length, beam, keel_z, deck_z, bow_lift, mat_index):
    y0 = -length / 2
    stations_y = [y0, y0 + length * 0.16, y0 + length * 0.5, y0 + length * 0.8, y0 + length]
    beam_scale = [0.76, 0.94, 1.0, 0.7, 0.045]
    keel_scale = [0.72, 0.95, 1.0, 0.62, 0.12]
    deck_scale = [0.9, 0.98, 1.0, 1.02, 1.0]
    rings = []
    for index, y in enumerate(stations_y):
        half = beam / 2 * beam_scale[index]
        keel = keel_z * keel_scale[index]
        gunwale = deck_z * deck_scale[index]
        if index == len(stations_y) - 1:
            gunwale = deck_z + bow_lift
        chine_z = keel + (gunwale - keel) * 0.4
        chine_x = half * 0.94
        rings.append([
            bm.verts.new((0, y, keel)),
            bm.verts.new((-chine_x, y, chine_z)),
            bm.verts.new((-half, y, gunwale)),
            bm.verts.new((half, y, gunwale)),
            bm.verts.new((chine_x, y, chine_z)),
        ])
    for aft, fore in zip(rings, rings[1:]):
        face(bm, [aft[0], fore[0], fore[1], aft[1]], mat_index)
        face(bm, [aft[1], fore[1], fore[2], aft[2]], mat_index)
        face(bm, [aft[2], fore[2], fore[3], aft[3]], mat_index)
        face(bm, [aft[3], fore[3], fore[4], aft[4]], mat_index)
        face(bm, [aft[4], fore[4], fore[0], aft[0]], mat_index)
    stern = rings[0]
    bow = rings[-1]
    face(bm, [stern[0], stern[4], stern[3], stern[2], stern[1]], mat_index)
    face(bm, [bow[0], bow[1], bow[2], bow[3], bow[4]], mat_index)
    return deck_z


def mast_and_sail(bm, y, deck_z, mast_height, sail_width, sail_height, mast_mat, sail_mat):
    half = 0.11
    box(bm, -half, half, y - half, y + half, deck_z, deck_z + mast_height, mast_mat)
    sail_bottom = deck_z + mast_height * 0.18
    sail_top = min(deck_z + mast_height * 0.9, sail_bottom + sail_height)
    box(
        bm,
        -sail_width / 2, sail_width / 2,
        y + 0.16, y + 0.28,
        sail_bottom, sail_top,
        sail_mat,
    )
    box(bm, -sail_width / 2, sail_width / 2, y + 0.05, y + 0.55, sail_bottom - 0.08, sail_bottom + 0.06, mast_mat)


def flag(bm, y, z, color, long_fly=False):
    box(bm, -0.04, 0.04, y - 0.04, y + 0.04, z, z + 1.5, WOOD)
    fly = 1.15 if long_fly else 0.55
    box(bm, 0.05, 0.08, y, y + fly, z + 1.05, z + 1.45, color)


def finish(bm):
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.001)


def emit(name, bm, location):
    finish(bm)
    mesh = bpy.data.meshes.new(name + "_mesh")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    assign(obj)
    collection.objects.link(obj)
    obj.location = location
    mesh.validate()
    mesh.calc_loop_triangles()
    print(name, "tris", len(mesh.loop_triangles), "location", tuple(round(v, 2) for v in location))
    return obj


scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1

for obj in list(bpy.data.objects):
    if obj.type == "MESH":
        bpy.data.objects.remove(obj, do_unlink=True)

collection = bpy.data.collections.get("COL_Geo")
if collection is None:
    collection = bpy.data.collections.new("COL_Geo")
    scene.collection.children.link(collection)
reference = bpy.data.collections.get("COL_Referencia")
if reference is None:
    reference = bpy.data.collections.new("COL_Referencia")
    scene.collection.children.link(reference)

world = scene.world
if world is None:
    world = bpy.data.worlds.new("Mar")
    scene.world = world
world.use_nodes = True
background = next(node for node in world.node_tree.nodes if node.type == "BACKGROUND")
for socket in background.inputs:
    label = (socket.identifier + " " + socket.name).lower()
    if "color" in label:
        socket.default_value = (0.773, 0.808, 0.820, 1)
    elif "strength" in label:
        socket.default_value = 0.85

light = next(obj for obj in bpy.data.objects if obj.type == "LIGHT")
light.data.type = "SUN"
light.data.energy = 2.4
light.data.color = (0.92, 0.94, 0.96)
light.rotation_euler = (0.55, 0.05, 0.4)

water_bm = new_bmesh()
box(water_bm, -80, 80, -40, 40, -0.08, 0.0, WATER)
water = emit("SM_AguaReferencia", water_bm, (0, 0, 0))
for user in list(water.users_collection):
    user.objects.unlink(water)
reference.objects.link(water)

coast_bm = new_bmesh()
box(coast_bm, -80, 80, -46, -38, -0.04, 0.02, COAST)
coast = emit("SM_CostaReferencia", coast_bm, (0, 0, 0))
for user in list(coast.users_collection):
    user.objects.unlink(coast)
reference.objects.link(coast)


def humble():
    bm = new_bmesh()
    deck = hull(bm, 12, 4, -0.55, 0.68, 0.35, WOOD)
    mast_and_sail(bm, -0.4, deck, 7, 2.1, 4.2, WOOD, SAIL)
    return emit("SM_Humilde", bm, (0, 0, 0))


def fisher():
    bm = new_bmesh()
    deck = hull(bm, 16, 4.5, -0.6, 0.78, 0.4, WOOD)
    for face_poly in bm.faces:
        center = face_poly.calc_center_median()
        normal = face_poly.normal
        if normal.z > 0.7 and center.z > deck * 0.75:
            face_poly.material_index = LINEN
    mast_and_sail(bm, -1.2, deck, 9, 2.3, 5.0, WOOD, SAIL)
    box(bm, 2.05, 2.2, -1.5, 2.4, deck + 1.1, deck + 1.28, WOOD)
    box(bm, 2.15, 3.7, -0.2, 2.5, deck - 2.7, deck + 1.15, TAR)
    flag(bm, -7.4, deck, FLAG_FISH)
    return emit("SM_Pesquero", bm, (16, 0, 0))


def cargo():
    bm = new_bmesh()
    deck = hull(bm, 24, 8, -0.9, 1.55, 0.45, WOOD)
    for face_poly in bm.faces:
        center = face_poly.calc_center_median()
        normal = face_poly.normal
        if normal.z > 0.7 and center.z > deck * 0.8:
            face_poly.material_index = TAR
    mast_and_sail(bm, -2.5, deck, 8, 3.2, 4.4, WOOD, SAIL)
    box(bm, -2.2, 2.2, -1.5, 3.2, deck, deck + 2.0, METAL)
    box(bm, -2.0, 1.8, 3.4, 7.2, deck, deck + 2.0, METAL)
    oriented_box(bm, Vector((0.3, 1.2, deck + 0.4)), Vector((0.15, 1, 0.35)), 7.5, 0.28, 0.28, METAL)
    flag(bm, -11.2, deck, FLAG_CARGO)
    return emit("SM_Carguero", bm, (38, 0, 0))


def fast():
    bm = new_bmesh()
    deck = hull(bm, 26, 5, -0.7, 0.95, 1.35, WOOD)
    mast_and_sail(bm, -1.0, deck, 14, 1.7, 8.5, WOOD, SAIL)
    for y in (-10, -5, 0, 5, 10):
        box(bm, -2.45, -2.28, y - 0.8, y + 0.8, deck, deck + 0.38, METAL)
        box(bm, 2.28, 2.45, y - 0.8, y + 0.8, deck, deck + 0.38, METAL)
    flag(bm, -12.2, deck, ACCENT)
    return emit("SM_CascoMejor", bm, (64, 0, 0))


ships = [humble(), fisher(), cargo(), fast()]

for ship in ships:
    corners = [ship.matrix_world @ Vector(corner) for corner in ship.bound_box]
    low = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
    high = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
    size = high - low
    print(ship.name, "world_m", round(size.x, 2), round(size.y, 2), round(size.z, 2))

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "barcos.blend"))
print("blend", os.path.join(OUT, "barcos.blend"))
